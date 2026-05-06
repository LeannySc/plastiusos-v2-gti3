import { Star, Recycle, Package, ShoppingBag } from "lucide-react";

const WelcomeHeader = ({ data, user }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none flex items-center gap-3">
          {data?.mensajeBienvenida || `¡HOLA!`}{" "}
          <span className="animate-bounce">👋</span>
        </h1>
        <p className="text-gray-400 mt-2 font-medium italic">
          {data?.descripcionBienvenida || "Sincronizando datos industriales..."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TARJETA 1: Puntos - Conectada a DashboardDTO.puntos */}
        <StatItem
          icon={Star}
          label={
            user.rol === "ENCARGADO" ? "BONIFICACIÓN $" : "PUNTOS DISPONIBLES"
          }
          value={data?.puntos || "0 pts"}
          color="text-emerald-500"
          bg="bg-emerald-50"
        />

        {/* TARJETA 2: Kg - Conectada a DashboardDTO.kgReciclados */}
        <StatItem
          icon={Recycle}
          label={
            user.rol === "ENCARGADO" ? "VACIADOS TOTALES" : "KG IMPACTO MUNDIAL"
          }
          value={data?.kgReciclados || "0 kg"}
          color="text-blue-500"
          bg="bg-blue-50"
        />

        {/* TARJETA 3: Entregas - Conectada a DashboardDTO.entregas */}
        <StatItem
          icon={Package}
          label="REGISTROS"
          value={data?.entregas || "0 Registros"}
          color="text-amber-500"
          bg="bg-amber-50"
        />

        {/* TARJETA 4: Nivel - Conectada a DashboardDTO.canjes */}
        <StatItem
          icon={ShoppingBag}
          label="STATUS RED"
          value={data?.canjes || "Buscando Nivel..."}
          color="text-purple-500"
          bg="bg-purple-50"
        />
      </div>
    </div>
  );
};

// Modificación del Mini Componente para soportar el truncate
const StatItem = ({ icon: Icon, label, value, color, bg }) => (
  <div
    className={`p-8 rounded-[40px] border border-gray-100 shadow-sm ${bg} transition-all hover:scale-[1.03] duration-500`}
  >
    <div
      className={`w-12 h-12 rounded-2xl ${color} bg-white flex items-center justify-center mb-4 shadow-sm`}
    >
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <h3
      className={`text-2xl font-black italic tracking-tighter ${color} leading-none`}
    >
      {value}
    </h3>
    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-3">
      {label}
    </p>
  </div>
);

export default WelcomeHeader;
