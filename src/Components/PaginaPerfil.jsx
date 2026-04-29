import { useState } from "react";
import {
  Star,
  Package,
  Clock,
  Edit2,
  ShieldCheck,
  Mail,
  User as UserIcon,
  Calendar,
  Trophy,
  Award,
  Zap,
  Bell,
  Globe,
  Lock,
  Save,
  X,
  Recycle,
} from "lucide-react";

const PaginaPerfil = ({ user }) => {
  const getInitials = (name) => {
    if (!name) return "??";

    const parts = name.trim().split(" ");

    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };
  // 1. ESTADOS DE EDICIÓN Y DATOS
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    nombre: user?.nombre || "Usuario Nuevo",
    correo: user?.correo || "",
    rol: user?.rol || "Sin Rol",
    fecha: user?.fechaCreacion?.split("T")[0] || "2024-01-15",
  });

  // 2. ESTADOS DE CONFIGURACIÓN (Toggles)
  const [config, setConfig] = useState({
    push: true,
    email: true,
    publico: false,
  });

  const handleSave = () => {
    setIsEditing(false);
    // Aquí iría la conexión al API de Java (UsuarioController -> actualizarPerfil)
    console.log("Datos guardados:", userData);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
          Mi Perfil
        </h1>
        <p className="text-gray-400 mt-1 font-medium italic text-lg">
          Gestiona tu información y revisa tu progreso
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LADO IZQUIERDO: Tarjeta MG y Puntos */}
        <div className="space-y-6">
          <div className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-[#10b981] rounded-full flex items-center justify-center font-black italic text-4xl text-white shadow-xl shadow-emerald-200 mb-6">
              {getInitials(userData.nombre)}
            </div>
            <h3 className="text-2xl font-black italic uppercase text-gray-900 leading-none">
              {userData.nombre}
            </h3>
            <p className="text-gray-400 font-medium mt-1">{userData.correo}</p>
            <span className="mt-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase italic border border-emerald-100 tracking-widest">
              {userData.rol}
            </span>
          </div>

          <div className="bg-[#10b981] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <p className="text-xs font-black uppercase italic opacity-80">
              Nivel Actual
            </p>
            <h3 className="text-2xl font-black italic uppercase mt-1 leading-none">
              Guerrero Verde
            </h3>
            <div className="flex items-center gap-3 mt-6">
              <Star className="fill-white" size={24} />
              <span className="text-4xl font-black tracking-tighter italic">
                {/* 🚀 AHORA EL SALDO ES REAL DESDE JAVA */}
                {user?.saldoPuntos || 0}{" "}
                <span className="text-xs uppercase font-medium">puntos</span>
              </span>
            </div>
            <div className="mt-6 w-full bg-black/10 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full w-[74%] rounded-full shadow-lg transition-all duration-1000"></div>
            </div>
            <p className="text-[10px] mt-2 font-bold italic opacity-70 italic tracking-tight">
              74% hacia Guardián del Planeta
            </p>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
            <MiniStat
              icon={Package}
              label="Entregas realizadas"
              value={user?.historialEntrega?.length || 0}
            />
            <MiniStat
              icon={Star}
              label="Pts totales ganados"
              value={user?.puntosGanadosTotal || 0}
            />
            <MiniStat
              icon={Clock}
              label="Canjes realizados"
              value={user?.pedidos?.length || 0}
            />
            <MiniStat
              icon={Calendar}
              label="Miembro desde"
              value={user?.fechaCreacion?.split("T")[0] || "2024"}
            />
          </div>
        </div>

        {/* LADO DERECHO: Formulario Dinámico y Logros */}
        <div className="lg:col-span-2 space-y-8">
          {/* INFORMACIÓN PERSONAL CON LÓGICA DE EDICIÓN */}
          <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm transition-all duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 italic tracking-tight uppercase">
                Información Personal
              </h3>
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#ecfdf5] text-emerald-600 rounded-full text-xs font-black uppercase hover:bg-emerald-500 hover:text-white transition-all group"
                  >
                    <Edit2
                      size={14}
                      className="group-hover:rotate-12 transition-transform"
                    />{" "}
                    Editar
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-full text-xs font-black uppercase hover:bg-emerald-600 shadow-lg shadow-emerald-200"
                    >
                      <Save size={14} /> Guardar
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-2.5 bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileInput
                label="Nombre completo"
                icon={UserIcon}
                value={userData.nombre}
                isEditing={isEditing}
                onChange={(val) => setUserData({ ...userData, nombre: val })}
              />
              <ProfileInput
                label="Correo electrónico"
                icon={Mail}
                value={userData.correo}
                isEditing={isEditing}
                onChange={(val) => setUserData({ ...userData, correo: val })}
              />
              <ProfileInput
                label="Rol en el sistema"
                icon={ShieldCheck}
                value={userData.rol}
                isEditing={false}
              />
              <ProfileInput
                label="Fecha de registro"
                icon={Calendar}
                value={userData.fecha}
                isEditing={false}
              />
            </div>
          </div>

          {/* LOGROS (Dinamismo Visual) */}
          <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 italic uppercase tracking-tight">
              Logros Obtenidos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <LogroCard
                icon={Trophy}
                label="Primera Entrega"
                sub="Meta alcanzada"
                active={true}
                color="bg-blue-50 text-blue-500"
              />
              <LogroCard
                icon={Recycle}
                label="10 Kg Reciclados"
                sub="Pionera"
                active={true}
                color="bg-emerald-50 text-emerald-500"
              />
              <LogroCard
                icon={Award}
                label="Primer Canje"
                sub="Eco-Fan"
                active={true}
                color="bg-orange-50 text-orange-500"
              />
              <LogroCard
                icon={Zap}
                label="50 Kg Reciclados"
                sub="Máximo aporte"
                active={true}
                color="bg-yellow-50 text-yellow-600"
              />
              <LogroCard
                icon={Trophy}
                label="Leyenda Eco"
                sub="Llega a 3000 pts"
                active={false}
                color="bg-gray-50 text-gray-300"
              />
            </div>
          </div>

          {/* 🟠 SECCIÓN CONFIGURACIÓN 🟠 */}
          <div className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-gray-900 italic uppercase tracking-tight">
              Configuración
            </h3>
            <div className="space-y-4">
              <ToggleRow
                icon={Bell}
                label="Notificaciones Push"
                sub="Recibe alertas de nuevas campañas"
                enabled={config.push}
                onToggle={() => setConfig({ ...config, push: !config.push })}
              />
              <ToggleRow
                icon={Mail}
                label="Notificaciones por Email"
                sub="Resumen semanal de actividad"
                enabled={config.email}
                onToggle={() => setConfig({ ...config, email: !config.email })}
              />
              <ToggleRow
                icon={Globe}
                label="Estadísticas Públicas"
                sub="Aparece en el ranking de recicladores"
                enabled={config.publico}
                onToggle={() =>
                  setConfig({ ...config, publico: !config.publico })
                }
              />
            </div>

            <button className="w-full flex items-center justify-center gap-3 px-6 py-5 border border-red-100 bg-red-50/10 rounded-[28px] text-red-500 font-black italic uppercase text-xs tracking-[0.2em] hover:bg-red-50 transition-all active:scale-[0.98]">
              <Lock size={16} strokeWidth={2.5} /> Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MINI COMPONENTES INTERNOS 🦾 ---

const ProfileInput = ({ label, icon: Icon, value, isEditing, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 flex items-center gap-2 ml-1 italic">
      <Icon size={12} /> {label}
    </label>
    {isEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border-2 border-emerald-100 px-5 py-4 rounded-2xl text-sm font-bold text-gray-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm shadow-emerald-50"
      />
    ) : (
      <div className="w-full bg-gray-50/70 border border-gray-100 px-5 py-4 rounded-2xl text-sm font-bold text-gray-600 italic tracking-tight">
        {value}
      </div>
    )}
  </div>
);

const ToggleRow = ({ icon: Icon, label, sub, enabled, onToggle }) => (
  <div
    className="flex items-center justify-between p-4 hover:bg-gray-50/50 rounded-[30px] transition-colors group cursor-pointer"
    onClick={onToggle}
  >
    <div className="flex items-center gap-4">
      <div
        className={`p-4 rounded-2xl transition-colors ${enabled ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm font-black uppercase tracking-tight text-gray-800">
          {label}
        </p>
        <p className="text-[10px] font-medium text-gray-400 italic mt-0.5">
          {sub}
        </p>
      </div>
    </div>
    <div
      className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${enabled ? "bg-[#10b981]" : "bg-gray-200"}`}
    >
      <div
        className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 ${enabled ? "translate-x-7" : ""}`}
      ></div>
    </div>
  </div>
);

const MiniStat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between group py-1">
    <div className="flex items-center gap-3 text-gray-400">
      <Icon size={16} />{" "}
      <span className="text-[12px] font-bold tracking-tight italic">
        {label}
      </span>
    </div>
    <span className="font-black text-gray-800 text-sm italic">{value}</span>
  </div>
);

const LogroCard = ({ icon: Icon, label, sub, active, color }) => (
  <div
    className={`p-6 rounded-[35px] transition-all flex flex-col items-center text-center space-y-2 border ${active ? color + " border-current/10 shadow-sm" : "bg-gray-50 border-gray-50"}`}
  >
    <div
      className={`p-4 rounded-2xl ${active ? "bg-white shadow-md shadow-black/5" : "bg-gray-100 text-gray-400"}`}
    >
      <Icon size={22} />
    </div>
    <h5
      className={`text-[11px] font-black uppercase tracking-tight leading-none ${active ? "text-gray-900" : "text-gray-300"}`}
    >
      {label}
    </h5>
    <p
      className={`text-[9px] font-bold opacity-60 italic ${active ? "" : "hidden"}`}
    >
      {sub}
    </p>
  </div>
);

export default PaginaPerfil;
