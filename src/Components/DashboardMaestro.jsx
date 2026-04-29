import {
  ChevronRight,
  ArrowRight,
  MapPin,
  Gift,
  History,
  Package,
} from "lucide-react";
import WelcomeHeader from "./Dashboard/WelcomeHeader";
import ChartsSection from "./Dashboard/ChartsSection";
import MaterialPrices from "./Dashboard/MaterialPrices";

const DashboardMaestro = ({ setActiveTab }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      {/* 1. Bienvenida y Stats */}
      <WelcomeHeader />

      {/* 2. Área de Gráficas e Impacto */}
      <ChartsSection />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Acciones Rápidas */}
        <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-xl font-bold text-gray-900 italic tracking-tight mb-6">
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            <ActionButton
              icon={MapPin}
              label="Buscar Punto de Entrega"
              color="bg-rose-50 text-rose-500"
              onClick={() => setActiveTab("puntos")}
            />
            <ActionButton
              icon={Gift}
              label="Canjear mis Puntos"
              color="bg-orange-50 text-orange-500"
              onClick={() => setActiveTab("catalogo")}
            />
            <ActionButton
              icon={History}
              label="Ver mis Entregas"
              color="bg-emerald-50 text-emerald-500"
              onClick={() => setActiveTab("historial")}
            />
          </div>

          {/* ECO NIVEL (BARRA) */}
          <div className="mt-8 bg-[#f0fdf4] p-5 rounded-[30px] border border-emerald-500/10">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] font-black uppercase italic text-emerald-700">
                🌱 Nivel Eco: Guerrero Verde
              </p>
              <ChevronRight size={14} className="text-emerald-400" />
            </div>
            <div className="w-full bg-emerald-200/40 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[68%] transition-all duration-1000"></div>
            </div>
            <p className="text-[9px] mt-2 font-bold text-emerald-600/70 italic text-center">
              680 / 1000 puntos para el siguiente nivel
            </p>
          </div>
        </div>

        {/* 4. Últimas Transacciones (Figma Mock) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 italic tracking-tight">
              Últimas Transacciones
            </h3>
            <button
              onClick={() => setActiveTab("historial")}
              className="flex items-center gap-1 text-emerald-500 font-black italic text-xs uppercase group"
            >
              Ver todas{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
          {/* Lista abreviada igual a tu Figma */}
          <div className="space-y-2">
            <MiniTx
              label="Entrega #1"
              date="2025-03-15"
              points="+280"
              status="Aprobado"
              statusColor="text-emerald-500 bg-emerald-50"
            />
            <MiniTx
              label="Entrega #2"
              date="2025-03-10"
              points="+175"
              status="Aprobado"
              statusColor="text-emerald-500 bg-emerald-50"
            />
            <MiniTx
              label="Entrega #3"
              date="2025-03-05"
              points="+190"
              status="Pendiente"
              statusColor="text-amber-500 bg-amber-50"
            />
            <MiniTx
              label="Entrega #4"
              date="2025-02-28"
              points="+310"
              status="Aprobado"
              statusColor="text-emerald-500 bg-emerald-50"
            />
          </div>
        </div>
      </div>

      {/* 5. Tabla de Precios por Material */}
      <MaterialPrices />
    </div>
  );
};

const ActionButton = ({ icon: Icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className="w-full group flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-white hover:shadow-md transition-all active:scale-95"
  >
    <div className="flex items-center gap-3 text-gray-700">
      <div className={`p-2.5 rounded-xl ${color} shadow-sm`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <span className="text-[12px] font-bold italic uppercase">{label}</span>
    </div>
    <ChevronRight
      size={16}
      className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all"
    />
  </button>
);

const MiniTx = ({ label, date, points, status, statusColor }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50/40 rounded-3xl group hover:bg-emerald-50/30 transition-all cursor-default">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white rounded-xl text-emerald-500 shadow-sm">
        <Package size={16} />
      </div>
      <div>
        <p className="text-[12px] font-black italic text-gray-800 uppercase leading-none">
          {label}
        </p>
        <p className="text-[9px] text-gray-400 mt-1">{date}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <span
        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic ${statusColor}`}
      >
        {status}
      </span>
      <span className="text-emerald-600 font-black italic text-lg tracking-tighter leading-none">
        {points} pts
      </span>
    </div>
  </div>
);

export default DashboardMaestro;
