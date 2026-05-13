import { useState, useEffect } from "react";
import {
  ChevronRight,
  ArrowRight,
  MapPin,
  Gift,
  History,
  Package,
  Loader2,
} from "lucide-react";
import WelcomeHeader from "./Dashboard/WelcomeHeader";
import ChartsSection from "./Dashboard/ChartsSection";
import MaterialPrices from "./Dashboard/MaterialPrices";

// ✅ CORRECCIÓN EN EL IMPORT: Subimos solo 1 nivel (de Components a src) y entramos a api
import { API_BASE_URL } from "../api/config";

const DashboardMaestro = ({ user, setActiveTab }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/dashboard/resumen/${user.id}`,
        );

        // ✅ 1. Primero verificamos si la respuesta es correcta
        if (!response.ok) throw new Error("Fallo en la respuesta del servidor");

        // ✅ 2. Solo llamamos a .json() UNA vez
        const result = await response.json();

        console.log("🛰️ GTI-Data cargada:", result);

        // ✅ 3. Guardamos los datos en el estado
        setData(result);
      } catch (error) {
        console.error("❌ Error en enlace Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user.id]); // Escucha cambios solo en el ID del usuario

  if (loading) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center animate-pulse">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
        <p className="font-black italic text-gray-400 uppercase tracking-widest text-xs">
          Accediendo a Bóveda de Datos...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      <WelcomeHeader data={data} user={user} />
      <ChartsSection data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

          <div className="mt-8 bg-[#f0fdf4] p-5 rounded-[30px] border border-emerald-500/10">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] font-black uppercase italic text-emerald-700">
                {data?.nombreNivel || "Cargando Nivel..."}
              </p>
              <ChevronRight size={14} className="text-emerald-400" />
            </div>
            <div className="w-full bg-emerald-200/40 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-1000"
                style={{ width: `${data?.progresoPorcentaje}%` }}
              ></div>
            </div>
            <p className="text-[9px] mt-2 font-bold text-emerald-600/70 italic text-center">
              Progreso Actual: {data?.progresoPorcentaje}%
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 italic tracking-tight uppercase">
              Actividad Reciente
            </h3>
            <button
              onClick={() => setActiveTab("historial")}
              className="flex items-center gap-1 text-emerald-500 font-black italic text-xs uppercase"
            >
              Ver bitácora completa <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {data?.ultimasActividades?.length > 0 ? (
              data.ultimasActividades.map((tx, i) => (
                <MiniTx
                  key={i}
                  label={tx.label}
                  date={tx.fecha}
                  points={tx.puntos}
                  status={tx.tipo === "ENTREGA" ? "VALIDADA" : "COMPLETADO"}
                  statusColor={
                    tx.tipo === "ENTREGA"
                      ? "text-emerald-500 bg-emerald-50"
                      : "text-amber-500 bg-amber-50"
                  }
                  tipo={tx.tipo}
                />
              ))
            ) : (
              <div className="py-10 text-center text-gray-300 font-black italic uppercase text-xs border-2 border-dashed border-gray-50 rounded-3xl">
                Sin movimientos registrados
              </div>
            )}
          </div>
        </div>
      </div>
      <MaterialPrices />
    </div>
  );
};

// --- COMPONENTES AUXILIARES PARA EVITAR "IS NOT DEFINED" ---
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
      className="text-gray-300 group-hover:translate-x-1 transition-all"
    />
  </button>
);

// Agregamos la prop 'tipo' para cambiar el icono
const MiniTx = ({ label, date, points, status, statusColor, tipo }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50/40 rounded-3xl group hover:bg-emerald-50/30 transition-all">
    <div className="flex items-center gap-4">
      {/* 🚀 Icono Dinámico: Si es ENTREGA muestra caja, si no, regalo */}
      <div
        className={`p-3 bg-white rounded-xl shadow-sm ${tipo === "ENTREGA" ? "text-emerald-500" : "text-amber-500"}`}
      >
        {tipo === "ENTREGA" ? <Package size={16} /> : <Gift size={16} />}
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
        {points}
      </span>
    </div>
  </div>
);

export default DashboardMaestro;
