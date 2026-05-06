import { useState, useEffect } from "react";
import {
  Package,
  Star,
  ShoppingBag,
  ArrowDownCircle,
  ChevronDown,
  Recycle,
  XCircle,
  Clock, // Añadimos este para las fechas
} from "lucide-react";
import { API_BASE_URL } from "../api/config";

const HistorialActividad = ({ user }) => {
  // 🚀 Mantengo toda tu estructura de estados intacta
  const [activeTab, setActiveTab] = useState("entregas");
  const [filter, setFilter] = useState("Todos");
  const [expandedId, setExpandedId] = useState(null);

  const [entregas, setEntregas] = useState([]);
  const [canjes, setCanjes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🆔 Prioridad: Si hay un usuario logueado usamos su ID, si no, el ID 1 para pruebas.
  const currentUserId = user?.id || 1;

  useEffect(() => {
    const cargarTodoElHistorial = async () => {
      try {
        setLoading(true);
        // 📡 1. Traer entregas desde UsuarioController
        const resEntregas = await fetch(
          `${API_BASE_URL}/identidad/${currentUserId}/historial`,
        );
        const dataEntregas = await resEntregas.json();

        // 📡 2. Traer canjes desde CanjeController
        const resCanjes = await fetch(
          `${API_BASE_URL}/canje/mis-canjes/${currentUserId}`,
        );
        const dataCanjes = await resCanjes.json();

        setEntregas(Array.isArray(dataEntregas) ? dataEntregas : []);
        setCanjes(Array.isArray(dataCanjes) ? dataCanjes : []);
        setLoading(false);
      } catch (error) {
        console.error("❌ Fallo en sincronización de historial:", error);
        setLoading(false);
      }
    };

    cargarTodoElHistorial();
  }, [currentUserId]);

  // 🛡️ Tu lógica de filtrado conservada y ACTIVA (para quitar el error rojo)
  const entregasFiltradas = entregas.filter(
    (e) =>
      filter === "Todos" ||
      e.estado === filter.toUpperCase() ||
      (filter === "Aprobado" && e.estado === "VALIDADA"),
  );

  // Cálculos conservados
  const totalEntregas = entregas.length;
  const puntosGanados = entregas.reduce(
    (acc, curr) => acc + (curr.puntosOtorgados || 0),
    0,
  );
  const totalCanjes = canjes.length;
  const puntosGastados = canjes.reduce(
    (acc, curr) => acc + (curr.producto?.costoPuntos || 0),
    0,
  );

  if (loading)
    return (
      <div className="h-[600px] flex items-center justify-center animate-pulse">
        <Recycle className="text-emerald-500 animate-spin mr-3" />
        <p className="font-black italic text-gray-400 uppercase tracking-widest text-xs">
          Sincronizando Actividad GTI-3...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* 🟢 TÍTULO */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
          Historial de Actividad
        </h1>
        <p className="text-gray-400 mt-1 font-medium italic">
          Registros auditados por la red industrial de Popayán.
        </p>
      </div>

      {/* 📊 MINI STAT CARDS - TU LÓGICA DE CÁLCULO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MiniStatCard
          icon={Package}
          label="Total Entregas"
          value={totalEntregas}
          color="text-gray-700"
        />
        <MiniStatCard
          icon={Star}
          label="Pts Ganados"
          value={`+${puntosGanados}`}
          color="text-emerald-500"
        />
        <MiniStatCard
          icon={ShoppingBag}
          label="Total Canjes"
          value={totalCanjes}
          color="text-gray-700"
        />
        <MiniStatCard
          icon={ArrowDownCircle}
          label="Pts Canjeados"
          value={`-${puntosGastados}`}
          color="text-amber-500"
        />
      </div>

      <div className="bg-white rounded-[35px] border border-gray-100 shadow-sm overflow-hidden">
        {/* NAVEGACIÓN (TABS) */}
        <div className="flex border-b border-gray-50 bg-gray-50/50">
          <TabButton
            active={activeTab === "entregas"}
            onClick={() => setActiveTab("entregas")}
            label="Entregas De Materiales"
            icon={Package}
          />
          <TabButton
            active={activeTab === "canjes"}
            onClick={() => setActiveTab("canjes")}
            label="Canjes De Puntos"
            icon={ShoppingBag}
          />
        </div>

        {activeTab === "entregas" ? (
          <>
            {/* 🔴 FILTROS (RE-INCORPORADOS PARA ELIMINAR EL ERROR DE VS CODE) */}
            <div className="p-6 flex items-center gap-4 bg-white border-b border-gray-50">
              <span className="text-[10px] font-black uppercase text-gray-400 italic">
                Filtrar Estado:
              </span>
              <div className="flex gap-2">
                {["Todos", "Aprobado", "Pendiente"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all 
                    ${filter === f ? "bg-emerald-500 text-white shadow-md" : "bg-gray-100 text-gray-400"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {entregasFiltradas.length > 0 ? (
                entregasFiltradas.map((entrega) => (
                  <EntregaRow
                    key={entrega.id}
                    entrega={entrega}
                    isExpanded={expandedId === entrega.id}
                    onToggle={() =>
                      setExpandedId(
                        expandedId === entrega.id ? null : entrega.id,
                      )
                    }
                  />
                ))
              ) : (
                <NoDataMessage
                  msg={`No se encontraron entregas de tipo: ${filter}`}
                />
              )}
            </div>
          </>
        ) : (
          /* PESTAÑA CANJES */
          <div className="divide-y divide-gray-50">
            {canjes.length > 0 ? (
              canjes.map((canje) => (
                <div
                  key={canje.id}
                  className="p-7 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 uppercase italic leading-none">
                        {canje.producto?.nombre}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-2 font-bold uppercase tracking-tight">
                        Pedido #{canje.id} · {canje.fechaPedido?.split("T")[0]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[9px] font-black italic uppercase">
                      {canje.estado}
                    </span>
                    <span className="font-black italic text-amber-500 text-xl">
                      -{canje.producto?.costoPuntos || 0} pts
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <NoDataMessage msg="Bolsa de premios vacía. ¡Recicla para empezar!" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- TUS COMPONENTES DE APOYO RE-VINCULADOS SIN ERRORES ---

const MiniStatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1">
    <div className={`p-4 rounded-2xl ${color} bg-gray-50`}>
      <Icon size={24} />
    </div>
    <div>
      <h3 className={`text-2xl font-black italic tracking-tighter ${color}`}>
        {value}
      </h3>
      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
        {label}
      </p>
    </div>
  </div>
);

const TabButton = ({ active, onClick, label, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-3 py-6 text-[11px] font-black italic uppercase transition-all ${active ? "bg-white text-emerald-600 border-b-4 border-emerald-500" : "bg-transparent text-gray-400 opacity-60 hover:opacity-100"}`}
  >
    <Icon size={16} /> {label}
  </button>
);

const EntregaRow = ({ entrega, isExpanded, onToggle }) => {
  const isAprobada =
    entrega.estado === "VALIDADA" || entrega.estado === "APROBADO";

  return (
    <div className={`transition-all ${isExpanded ? "bg-emerald-50/10" : ""}`}>
      <div
        onClick={onToggle}
        className="flex items-center justify-between p-7 cursor-pointer hover:bg-gray-50/50"
      >
        <div className="flex items-center gap-5">
          <div
            className={`p-3 rounded-2xl ${isAprobada ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
          >
            <Recycle size={22} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 uppercase italic">
              Ticket: #{entrega.id}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-bold uppercase italic">
              <Clock size={12} /> {entrega.fechaEntrega?.split("T")[0]}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${isAprobada ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}
          >
            {isAprobada ? "VALIDADA" : "PENDIENTE"}
          </div>
          <span className="text-xl font-black italic text-emerald-600">
            +{entrega.puntosOtorgados} pts
          </span>
          <ChevronDown
            size={18}
            className={`text-gray-300 transition-transform duration-300 ${isExpanded ? "rotate-180 text-emerald-500" : ""}`}
          />
        </div>
      </div>

      {/* 🚀 EL DESGLOSE DE MATERIALES QUE ME PEDISTE CONSERVADO */}
      <div
        className={`overflow-hidden transition-all duration-500 ${isExpanded ? "max-h-[500px] border-t border-gray-100" : "max-h-0"}`}
      >
        <div className="p-8 space-y-6">
          <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.1em] italic">
            Detalle Técnico de Materiales
          </h5>
          <div className="space-y-2">
            {entrega.detalles?.map((d, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-gray-100 group hover:bg-emerald-50 transition-colors"
              >
                <span className="font-bold text-gray-700">
                  {d.material?.nombre || "Carga de Residuos"}
                </span>
                <div className="flex gap-12">
                  <span className="text-gray-400 font-black italic text-xs">
                    {d.cantidad} kg
                  </span>
                  <span className="text-emerald-500 font-black italic">
                    +{d.puntosOtorgados} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-dashed border-gray-200 flex justify-between px-6">
            <span className="font-bold text-gray-400 uppercase text-[10px]">
              Puntos Liquidados
            </span>
            <span className="text-2xl font-black italic text-emerald-600">
              +{entrega.puntosOtorgados} pts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const NoDataMessage = ({ msg }) => (
  <div className="py-24 text-center">
    <XCircle className="text-gray-100 mx-auto mb-3 animate-pulse" size={50} />
    <p className="text-gray-400 font-black italic uppercase text-xs tracking-widest">
      {msg}
    </p>
  </div>
);

export default HistorialActividad;
