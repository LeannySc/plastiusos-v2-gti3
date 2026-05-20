import { useState, useEffect, useCallback } from "react";
import { 
  Bell, 
  Zap, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  Mail, 
  Smartphone,
  User,
  Package,
  AlertTriangle,
  Gift,
  Trash2,
  Settings,
  X,
  Award,
  Megaphone
} from "lucide-react";
import { API_BASE_URL } from "../../api/config";
import { toast } from "sonner";

// 🟢 CONFIGURACIÓN DE NOTIFICACIONES POR ROL
const NOTIF_CONFIG_BY_ROLE = {
  RECICLADOR: [
    { id: "puntos_recibidos", label: "Puntos recibidos", icon: Zap, enabled: true, javaSource: "PuntosController.java" },
    { id: "canje_confirmado", label: "Canje confirmado", icon: Gift, enabled: true, javaSource: "CanjeController.java" },
    { id: "nivel_alcanzado", label: "Nuevo nivel alcanzado", icon: Award, enabled: true, javaSource: "UsuarioController.java" },
    { id: "campana_activa", label: "Campaña activa", icon: Megaphone, enabled: false, javaSource: "CampanaController.java" },
  ],
  ENCARGADO: [
    { id: "bote_lleno", label: "Bote lleno - Ruta asignada", icon: AlertTriangle, enabled: true, javaSource: "LogisticaController.java" },
    { id: "mision_aceptada", label: "Misión aceptada", icon: CheckCircle2, enabled: true, javaSource: "LogisticaController.java" },
    { id: "ruta_completada", label: "Ruta completada", icon: MapPin, enabled: true, javaSource: "RutaController.java" },
  ],
  ADMINISTRADOR: [
    { id: "usuario_nuevo", label: "Usuario nuevo registrado", icon: User, enabled: true, javaSource: "UsuarioController.java" },
    { id: "canje_pendiente", label: "Canje pendiente aprobación", icon: Package, enabled: true, javaSource: "CanjeController.java" },
    { id: "alerta_sistema", label: "Alerta del sistema", icon: AlertTriangle, enabled: true, javaSource: "SistemaController.java" },
    { id: "reporte_diario", label: "Reporte diario", icon: Mail, enabled: false, javaSource: "ReporteController.java" },
  ],
};

// 🟡 SIMULACIÓN DE DATOS PARA DEMOSTRACIÓN
const SIMULATED_NOTIFICATIONS = [
  {
    id: 1,
    tipo: "puntos_recibidos",
    titulo: "¡Puntos recibidos!",
    mensaje: "Has ganado 150 puntos por reciclar 3kg de plástico PET",
    rol: "RECICLADOR",
    leida: false,
    emailEnviado: true,
    fecha: new Date().toISOString(),
    javaSource: "PuntosController.java",
    color: "emerald",
  },
  {
    id: 2,
    tipo: "bote_lleno",
    titulo: "🚨 BOTE LLENO - URGENTE",
    mensaje: "Punto 'Plaza Principal' al 95% de capacidad. Se requiere recolección inmediata.",
    rol: "ENCARGADO",
    leida: false,
    emailEnviado: true,
    fecha: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // hace 5 min
    javaSource: "LogisticaController.java",
    color: "amber",
  },
  {
    id: 3,
    tipo: "canje_confirmado",
    titulo: "✅ Canje confirmado",
    mensaje: "Tu canje de 'Botella Ecológica 750ml' ha sido aprobado. Puntos descontados: 500",
    rol: "RECICLADOR",
    leida: true,
    emailEnviado: true,
    fecha: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // hace 30 min
    javaSource: "CanjeController.java",
    color: "violet",
  },
];

const NotificationBell = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFeed, setShowFeed] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState(user?.rol || "RECICLADOR");

  // Fetch inicial de notificaciones
  const fetchNotificaciones = useCallback(async () => {
    if (!user) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/notificaciones?usuarioId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotificaciones(data);
      } else {
        // Fallback a datos simulados para demo
        setNotificaciones(SIMULATED_NOTIFICATIONS.filter(n => n.rol === activeRole));
      }
    } catch (err) {
      console.error("🔔 Error fetching notifications:", err);
      setNotificaciones(SIMULATED_NOTIFICATIONS.filter(n => n.rol === activeRole));
    }
  }, [user, activeRole]);

  useEffect(() => {
    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 30000); // Polling cada 30s
    return () => clearInterval(interval);
  }, [fetchNotificaciones]);

  // 🔴 DISPARAR NOTIFICACIÓN SIMULADA
  const triggerNotification = (tipo) => {
    const nuevaNotif = {
      id: Date.now(),
      tipo,
      titulo: getTituloPorTipo(tipo),
      mensaje: getMensajePorTipo(tipo),
      rol: activeRole,
      leida: false,
      emailEnviado: true,
      fecha: new Date().toISOString(),
      javaSource: getJavaSourcePorTipo(tipo),
      color: getColorPorTipo(tipo),
    };
    
    setNotificaciones(prev => [nuevaNotif, ...prev]);
    
    toast.success("📬 Notificación disparada", {
      description: `Email enviado vía Resend + Push nativa activada`,
    });
  };

  // Marcar todas como leídas
  const marcarTodasLeidas = async () => {
    try {
      await fetch(`${API_BASE_URL}/notificaciones/marcar-leidas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: user.id }),
      });
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
      toast.success("✅ Todas las notificaciones marcadas como leídas");
    } catch (err) {
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    }
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <>
      {/* 🔔 CAMPANITA PRINCIPAL */}
      <button
        onClick={() => setShowFeed(!showFeed)}
        className={`relative p-2.5 rounded-2xl border transition-all group ${
          notificacionesNoLeidas > 0
            ? "bg-amber-50 border-amber-200 text-amber-500 shadow-sm"
            : "bg-gray-50 border-gray-100 text-gray-400"
        }`}
      >
        <Bell
          size={20}
          className={`${notificacionesNoLeidas > 0 ? "animate-[bounce_2s_infinite]" : ""} group-hover:scale-110 transition-transform`}
        />
        {notificacionesNoLeidas > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
            {notificacionesNoLeidas}
          </span>
        )}
      </button>

      {/* 📱 FEED DE NOTIFICACIONES COMPLETO */}
      {showFeed && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setShowFeed(false)}></div>
          <div className="fixed right-4 top-20 w-[420px] bg-white rounded-[35px] shadow-2xl border border-gray-100 z-[70] overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
            
            {/* HEADER */}
            <div className="p-5 bg-[#111827] text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-amber-400 fill-amber-400" />
                <h4 className="font-black italic uppercase text-[10px] tracking-widest">
                  Centro de Notificaciones
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={activeRole}
                  onChange={(e) => setActiveRole(e.target.value)}
                  className="bg-white/10 px-2 py-0.5 rounded text-[8px] font-bold text-gray-300 italic border border-white/20 outline-none"
                >
                  <option value="RECICLADOR">Reciclador</option>
                  <option value="ENCARGADO">Encargado</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
                <button onClick={() => setShowFeed(false)} className="text-gray-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN RÁPIDA */}
            <div className="p-4 bg-gray-50 border-b border-gray-100 shrink-0">
              <p className="text-[9px] font-black uppercase text-gray-400 italic mb-2">Simular eventos:</p>
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={() => triggerNotification("puntos_recibidos")}
                  className="flex-1 min-w-[80px] bg-emerald-500 text-white px-3 py-2 rounded-xl font-black italic uppercase text-[8px] tracking-wider hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-100"
                >
                  + Puntos
                </button>
                <button 
                  onClick={() => triggerNotification("bote_lleno")}
                  className="flex-1 min-w-[80px] bg-amber-500 text-white px-3 py-2 rounded-xl font-black italic uppercase text-[8px] tracking-wider hover:bg-amber-600 active:scale-95 transition-all shadow-md shadow-amber-100"
                >
                  Bote lleno
                </button>
                <button 
                  onClick={() => triggerNotification("canje_confirmado")}
                  className="flex-1 min-w-[80px] bg-violet-500 text-white px-3 py-2 rounded-xl font-black italic uppercase text-[8px] tracking-wider hover:bg-violet-600 active:scale-95 transition-all shadow-md shadow-violet-100"
                >
                  Canje
                </button>
                <button 
                  onClick={marcarTodasLeidas}
                  className="flex-1 min-w-[80px] bg-gray-200 text-gray-600 px-3 py-2 rounded-xl font-black italic uppercase text-[8px] tracking-wider hover:bg-gray-300 active:scale-95 transition-all"
                >
                  Marcar leídas
                </button>
              </div>
            </div>

            {/* LISTA DE NOTIFICACIONES */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {notificaciones.length > 0 ? (
                notificaciones.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-gray-50/80 transition-colors ${!notif.leida ? "bg-white" : "bg-gray-50/30"}`}
                  >
                    <div className="flex gap-4">
                      <div className={`p-3 rounded-2xl h-fit ${getColorBg(notif.color)} ${getColorText(notif.color)}`}>
                        <getIconByType(notif.tipo) size={18} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className={`font-black italic uppercase text-[10px] leading-tight mb-1 ${!notif.leida ? "text-gray-900" : "text-gray-500"}`}>
                            {notif.titulo}
                          </h5>
                          {!notif.leida && (
                            <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 animate-pulse"></span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium mb-2 line-clamp-2">
                          {notif.mensaje}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {notif.emailEnviado && (
                              <span className="flex items-center gap-1 text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <Mail size={8} /> Email enviado
                              </span>
                            )}
                            <span className="text-[8px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                              {notif.javaSource}
                            </span>
                          </div>
                          <span className="text-[9px] text-gray-400 italic">
                            {formatFecha(notif.fecha)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-14 text-center">
                  <CheckCircle2 size={35} className="mx-auto text-emerald-100 mb-3" />
                  <p className="text-[11px] font-black uppercase text-gray-300 italic tracking-widest">
                    Todo en orden
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER CON LINK A PREFERENCIAS */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0">
              <button 
                onClick={() => {
                  setShowFeed(false);
                  // Aquí se podría navegar a la página de preferencias
                }}
                className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Settings size={12} /> Gestionar preferencias
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Helpers
const getTituloPorTipo = (tipo) => {
  const titulos = {
    puntos_recibidos: "¡Puntos recibidos!",
    bote_lleno: "🚨 BOTE LLENO - URGENTE",
    canje_confirmado: "✅ Canje confirmado",
  };
  return titulos[tipo] || "Nueva notificación";
};

const getMensajePorTipo = (tipo) => {
  const mensajes = {
    puntos_recibidos: "Has ganado 150 puntos por reciclar 3kg de plástico PET",
    bote_lleno: "Punto 'Plaza Principal' al 95% de capacidad. Se requiere recolección inmediata.",
    canje_confirmado: "Tu canje ha sido aprobado. Puntos descontados: 500",
  };
  return mensajes[tipo] || "Nueva actividad en tu cuenta";
};

const getJavaSourcePorTipo = (tipo) => {
  const sources = {
    puntos_recibidos: "PuntosController.java",
    bote_lleno: "LogisticaController.java",
    canje_confirmado: "CanjeController.java",
  };
  return sources[tipo] || "NotificacionController.java";
};

const getColorPorTipo = (tipo) => {
  const colors = {
    puntos_recibidos: "emerald",
    bote_lleno: "amber",
    canje_confirmado: "violet",
  };
  return colors[tipo] || "gray";
};

const getIconByType = (tipo) => {
  const icons = {
    puntos_recibidos: Zap,
    bote_lleno: AlertTriangle,
    canje_confirmado: Gift,
  };
  return icons[tipo] || Bell;
};

const getColorBg = (color) => {
  const bgs = {
    emerald: "bg-emerald-50",
    amber: "bg-amber-50",
    violet: "bg-violet-50",
  };
  return bgs[color] || "bg-gray-50";
};

const getColorText = (color) => {
  const texts = {
    emerald: "text-emerald-500",
    amber: "text-amber-500",
    violet: "text-violet-500",
  };
  return texts[color] || "text-gray-500";
};

const formatFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  const ahora = new Date();
  const diffMin = Math.floor((ahora - fecha) / 60000);
  
  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffHoras = Math.floor(diffMin / 60);
  if (diffHoras < 24) return `hace ${diffHoras}h`;
  return fecha.toLocaleDateString("es-CO");
};

export default NotificationBell;
