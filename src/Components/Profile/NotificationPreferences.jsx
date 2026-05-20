import { useState } from "react";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Zap, 
  AlertTriangle, 
  Gift, 
  User, 
  Package, 
  CheckCircle2,
  MapPin,
  Settings,
  Save,
  X,
  Award,
  Megaphone
} from "lucide-react";
import { API_BASE_URL } from "../../api/config";
import { toast } from "sonner";

// 🟢 CONFIGURACIÓN COMPLETA DE NOTIFICACIONES POR ROL CON ORIGEN JAVA
const NOTIF_CONFIG_BY_ROLE = {
  RECICLADOR: [
    { 
      id: "puntos_recibidos", 
      label: "Puntos recibidos", 
      descripcion: "Cada vez que reciclas y ganas puntos",
      icon: Zap, 
      enabled: true, 
      javaSource: "PuntosController.java",
      endpoint: "POST /api/puntos/agregar",
      emailTemplate: "puntos_recibidos"
    },
    { 
      id: "canje_confirmado", 
      label: "Canje confirmado", 
      descripcion: "Cuando tu canje es aprobado",
      icon: Gift, 
      enabled: true, 
      javaSource: "CanjeController.java",
      endpoint: "POST /api/canje/confirmar",
      emailTemplate: "canje_confirmado"
    },
    { 
      id: "nivel_alcanzado", 
      label: "Nuevo nivel alcanzado", 
      descripcion: "Subes de nivel en el programa",
      icon: Award, 
      enabled: true, 
      javaSource: "UsuarioController.java",
      endpoint: "PUT /api/usuario/actualizar-nivel",
      emailTemplate: "nivel_alcanzado"
    },
    { 
      id: "campana_activa", 
      label: "Campaña activa", 
      descripcion: "Nuevas campañas de reciclaje",
      icon: Megaphone, 
      enabled: false, 
      javaSource: "CampanaController.java",
      endpoint: "POST /api/campanas/activar",
      emailTemplate: "campana_activa"
    },
  ],
  ENCARGADO: [
    { 
      id: "bote_lleno", 
      label: "Bote lleno - Ruta asignada", 
      descripcion: "Alerta de punto de recolección lleno",
      icon: AlertTriangle, 
      enabled: true, 
      javaSource: "LogisticaController.java",
      endpoint: "GET /api/logistica/botes-cercanos",
      emailTemplate: "bote_lleno"
    },
    { 
      id: "mision_aceptada", 
      label: "Misión aceptada", 
      descripcion: "Confirmación de ruta aceptada",
      icon: CheckCircle2, 
      enabled: true, 
      javaSource: "LogisticaController.java",
      endpoint: "POST /api/logistica/aceptar-mision",
      emailTemplate: "mision_aceptada"
    },
    { 
      id: "ruta_completada", 
      label: "Ruta completada", 
      descripcion: "Resumen de ruta finalizada",
      icon: MapPin, 
      enabled: true, 
      javaSource: "RutaController.java",
      endpoint: "PUT /api/rutas/completar",
      emailTemplate: "ruta_completada"
    },
  ],
  ADMINISTRADOR: [
    { 
      id: "usuario_nuevo", 
      label: "Usuario nuevo registrado", 
      descripcion: "Nuevo usuario en el sistema",
      icon: User, 
      enabled: true, 
      javaSource: "UsuarioController.java",
      endpoint: "POST /api/usuarios/registro",
      emailTemplate: "usuario_nuevo"
    },
    { 
      id: "canje_pendiente", 
      label: "Canje pendiente aprobación", 
      descripcion: "Canjes que requieren validación",
      icon: Package, 
      enabled: true, 
      javaSource: "CanjeController.java",
      endpoint: "GET /api/canje/pendientes",
      emailTemplate: "canje_pendiente"
    },
    { 
      id: "alerta_sistema", 
      label: "Alerta del sistema", 
      descripcion: "Incidencias técnicas críticas",
      icon: AlertTriangle, 
      enabled: true, 
      javaSource: "SistemaController.java",
      endpoint: "POST /api/sistema/alertas",
      emailTemplate: "alerta_sistema"
    },
    { 
      id: "reporte_diario", 
      label: "Reporte diario", 
      descripcion: "Resumen métricas diarias",
      icon: Mail, 
      enabled: false, 
      javaSource: "ReporteController.java",
      endpoint: "GET /api/reportes/diario",
      emailTemplate: "reporte_diario"
    },
  ],
};

const NotificationPreferences = ({ user, onClose }) => {
  const [selectedRole, setSelectedRole] = useState(user?.rol || "RECICLADOR");
  const [preferences, setPreferences] = useState(() => {
    // Cargar preferencias guardadas o usar defaults
    const saved = localStorage.getItem(`notif_prefs_${user?.id}_${selectedRole}`);
    if (saved) return JSON.parse(saved);
    
    // Defaults por rol
    const config = NOTIF_CONFIG_BY_ROLE[selectedRole];
    return config.reduce((acc, item) => {
      acc[item.id] = { push: item.enabled, email: item.enabled };
      return acc;
    }, {});
  });
  const [saving, setSaving] = useState(false);

  // Actualizar preferencias cuando cambia el rol
  useState(() => {
    const config = NOTIF_CONFIG_BY_ROLE[selectedRole];
    setPreferences(prev => {
      const updated = { ...prev };
      config.forEach(item => {
        if (!updated[item.id]) {
          updated[item.id] = { push: item.enabled, email: item.enabled };
        }
      });
      return updated;
    });
  });

  const togglePreference = (notifId, type) => {
    setPreferences(prev => ({
      ...prev,
      [notifId]: {
        ...prev[notifId],
        [type]: !prev[notifId]?.[type]
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Guardar en backend
      await fetch(`${API_BASE_URL}/preferencias/notificaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: user.id,
          rol: selectedRole,
          preferencias: preferences
        }),
      });
      
      // Guardar en localStorage como backup
      localStorage.setItem(`notif_prefs_${user.id}_${selectedRole}`, JSON.stringify(preferences));
      
      toast.success("✅ Preferencias guardadas correctamente");
      onClose?.();
    } catch (err) {
      console.error("Error saving preferences:", err);
      // Fallback a localStorage
      localStorage.setItem(`notif_prefs_${user.id}_${selectedRole}`, JSON.stringify(preferences));
      toast.success("✅ Preferencias guardadas (local)");
    } finally {
      setSaving(false);
    }
  };

  const currentConfig = NOTIF_CONFIG_BY_ROLE[selectedRole];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[45px] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col">
        
        {/* HEADER */}
        <div className="p-6 bg-[#111827] text-white shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-3 rounded-2xl">
                <Bell size={24} className="fill-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tight">
                  Preferencias de Notificación
                </h2>
                <p className="text-gray-400 text-xs font-medium italic">
                  Configura qué alertas quieres recibir
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Selector de Rol */}
          <div className="flex gap-2 mt-4">
            {Object.keys(NOTIF_CONFIG_BY_ROLE).map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex-1 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  selectedRole === role
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                {role.charAt(0) + role.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* LISTA DE PREFERENCIAS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={16} className="text-gray-400" />
            <p className="text-xs font-bold text-gray-500 uppercase italic">
              Configuración para rol: <span className="text-emerald-600">{selectedRole}</span>
            </p>
          </div>

          {currentConfig.map((notif) => {
            const Icon = notif.icon;
            const pref = preferences[notif.id] || { push: false, email: false };
            
            return (
              <div 
                key={notif.id}
                className="bg-gray-50 rounded-[30px] p-5 border border-gray-100 hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm text-emerald-500">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black italic uppercase text-gray-900 text-sm">
                      {notif.label}
                    </h4>
                    <p className="text-gray-500 text-[10px] font-medium mt-0.5">
                      {notif.descripcion}
                    </p>
                  </div>
                </div>
                
                {/* Toggles */}
                <div className="flex items-center justify-between pl-[60px]">
                  <div className="flex items-center gap-6">
                    {/* Toggle Push */}
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={pref.push}
                          onChange={() => togglePreference(notif.id, "push")}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${
                          pref.push ? "bg-emerald-500" : "bg-gray-300"
                        }`}>
                          <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transition-transform ${
                            pref.push ? "translate-x-6" : ""
                          }`}></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Smartphone size={12} className="text-gray-400" />
                        <span className="text-[9px] font-black uppercase text-gray-600">Push</span>
                      </div>
                    </label>
                    
                    {/* Toggle Email */}
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={pref.email}
                          onChange={() => togglePreference(notif.id, "email")}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${
                          pref.email ? "bg-violet-500" : "bg-gray-300"
                        }`}>
                          <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transition-transform ${
                            pref.email ? "translate-x-6" : ""
                          }`}></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} className="text-gray-400" />
                        <span className="text-[9px] font-black uppercase text-gray-600">Email</span>
                      </div>
                    </label>
                  </div>
                  
                  {/* Badge de origen Java */}
                  <div className="text-right">
                    <code className="text-[9px] font-mono bg-gray-200 px-2 py-1 rounded text-gray-600 block">
                      {notif.javaSource}
                    </code>
                    <code className="text-[8px] font-mono text-gray-400 block mt-0.5">
                      {notif.endpoint}
                    </code>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER CON BOTÓN GUARDAR */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-[10px] font-bold text-gray-500 italic">
                Los cambios se sincronizan con el backend en tiempo real
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-200 bg-white rounded-[28px] text-gray-500 font-black italic uppercase text-xs tracking-widest hover:bg-gray-50 transition-all"
            >
              <X size={16} /> Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 text-white rounded-[28px] font-black italic uppercase text-xs tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <Save size={16} /> Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
