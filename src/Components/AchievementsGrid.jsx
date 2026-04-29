import {
  Award,
  Zap,
  Trophy,
  Bell,
  Mail as MailIcon,
  Globe,
  Lock,
} from "lucide-react";

export const AchievementsGrid = () => (
  <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm space-y-8">
    <h3 className="text-xl font-bold text-gray-900">Logros Obtenidos</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <LogroCard
        icon={Trophy}
        label="Primera Entrega"
        sub="Completaste tu primera entrega"
        active={true}
        color="bg-blue-50 text-blue-500"
      />
      <LogroCard
        icon={RecycleIcon}
        label="10 Kg Reciclados"
        sub="Reciclaste tus primeros 10kg"
        active={true}
        color="bg-emerald-50 text-emerald-500"
      />
      <LogroCard
        icon={Award}
        label="Primer Canje"
        sub="Realizaste tu primer canje"
        active={true}
        color="bg-orange-50 text-orange-500"
      />
      <LogroCard
        icon={Zap}
        label="50 Kg Reciclados"
        sub="Reciclaste 50kg en total"
        active={true}
        color="bg-emerald-50 text-emerald-500"
      />
      <LogroCard
        icon={Trophy}
        label="100 Kg Reciclados"
        sub="Llega a los 100kg"
        active={false}
        color="bg-gray-50 text-gray-300"
      />
      <LogroCard
        icon={Trophy}
        label="Leyenda Eco"
        sub="Alcanza 3000 puntos"
        active={false}
        color="bg-gray-50 text-gray-300"
      />
    </div>
  </div>
);

export const ConfigurationCard = () => (
  <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm space-y-6">
    <h3 className="text-xl font-bold text-gray-900">Configuración</h3>
    <div className="space-y-1">
      <ToggleItem
        icon={Bell}
        label="Notificaciones Push"
        sub="Recibe alertas de nuevas campañas"
        defaultCheck={true}
      />
      <ToggleItem
        icon={MailIcon}
        label="Notificaciones por Email"
        sub="Resumen semanal de actividad"
        defaultCheck={true}
      />
      <ToggleItem
        icon={Globe}
        label="Estadísticas Públicas"
        sub="Aparece en el ranking de recicladores"
        defaultCheck={false}
      />
    </div>
    <button className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-red-100 rounded-3xl text-red-500 font-black italic uppercase text-xs tracking-widest hover:bg-red-50 transition-all">
      <Lock size={16} /> Cambiar Contraseña
    </button>
  </div>
);

// Auxiliares internos
const RecycleIcon = () => <Award size={20} />; // Dummy placeholder para coherencia
const LogroCard = ({ icon: Icon, label, sub, active, color }) => (
  <div
    className={`p-5 rounded-[30px] border border-transparent transition-all flex flex-col items-center text-center space-y-2 ${active ? color + " border-current/10" : "bg-gray-50"}`}
  >
    <div className={`p-3 rounded-2xl ${active ? "bg-white" : "bg-gray-100"}`}>
      <Icon size={24} />
    </div>
    <div>
      <h5
        className={`text-xs font-bold leading-tight ${active ? "" : "text-gray-400"}`}
      >
        {label}
      </h5>
      <p className="text-[9px] font-medium opacity-60 mt-1 leading-tight">
        {sub}
      </p>
    </div>
  </div>
);

const ToggleItem = ({ icon: Icon, label, sub, defaultCheck }) => (
  <div className="flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50 transition-all">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-xl text-gray-500">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-700">{label}</p>
        <p className="text-[10px] font-medium text-gray-400">{sub}</p>
      </div>
    </div>
    <div
      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${defaultCheck ? "bg-emerald-500" : "bg-gray-200"}`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full transition-transform ${defaultCheck ? "translate-x-6" : ""}`}
      ></div>
    </div>
  </div>
);
