import { Leaf, Info } from "lucide-react";

const PanelStatus = ({ selectedPunto, listaPuntos = [] }) => {
  // ✅ 1. Filtramos la lista para que el radar solo tome botes que están "en la calle"
  const puntosActivos = listaPuntos.filter((p) => p.activo === true);

  // Lógica de colores unificada (GTI-3 Standard)
  const getStatusDetails = (punto) => {
    if (!punto) return null;
    const nivel = punto.nivelLlenado;
    if (
      nivel > 80 ||
      punto.estadoBote === "LLENO" ||
      punto.estadoBote === "LLENO/CRÍTICO"
    ) {
      return { color: "#ef4444", label: "LLENO" }; // ✅ Cambiado: Ya no es inactivo
    }
    if (nivel > 40) {
      return { color: "#f59e0b", label: "MEDIO" };
    }
    return { color: "#10b981", label: "DISPONIBLE" };
  };

  const stats = {
    // ✅ 2. Contamos sobre puntosActivos para evitar botes fantasmas
    disponibles: puntosActivos.filter((p) => p.nivelLlenado <= 40).length,
    medios: puntosActivos.filter(
      (p) => p.nivelLlenado > 40 && p.nivelLlenado <= 80,
    ).length,
    llenos: puntosActivos.filter(
      (p) =>
        p.nivelLlenado > 80 ||
        p.estadoBote === "LLENO" ||
        p.estadoBote === "LLENO/CRÍTICO",
    ).length,
  };

  const infoExtra = getStatusDetails(selectedPunto);

  return (
    <div className="space-y-4">
      {/* 1. LEYENDA ESTADO */}
      <div className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm">
        <h3 className="font-black italic uppercase text-sm tracking-widest text-gray-800 mb-4">
          ESTADO DE BOTES
        </h3>
        <ul className="space-y-4">
          <StatusItem
            color="bg-[#10b981]"
            label="Disponible"
            count={stats.disponibles}
          />
          <StatusItem color="bg-[#f59e0b]" label="Medio" count={stats.medios} />
          {/* ✅ 3. Nombre corregido: Solo "Lleno" */}
          <StatusItem color="bg-[#ef4444]" label="Lleno" count={stats.llenos} />
        </ul>
      </div>

      <div className="bg-[#f0fdf4] p-5 rounded-[35px] border border-emerald-100 flex items-start gap-4">
        <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20 text-white">
          <Leaf size={18} fill="currentColor" />
        </div>
        {/* ✅ 4. Contador corregido en el texto descriptivo */}
        <p className="text-[#065f46] text-sm font-bold leading-snug italic py-1">
          {puntosActivos.length} nodos activos sincronizados con Popayán.
        </p>
      </div>

      {/* 3. DETALLE DINÁMICO */}
      {selectedPunto && (
        <div className="bg-white p-6 rounded-[35px] border-2 border-emerald-500/10 shadow-lg animate-in fade-in zoom-in duration-500">
          <div className="flex items-center gap-2 mb-1 text-emerald-500">
            <Info size={14} />
            <h4 className="text-[10px] font-black uppercase italic tracking-[0.2em]">
              Telemetría
            </h4>
          </div>
          <p className="font-bold text-gray-800 text-xl tracking-tight mb-2">
            {selectedPunto.nombre}
          </p>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 mb-4 inline-flex">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: infoExtra.color }}
            ></span>
            <span
              className="text-[10px] font-black uppercase italic"
              style={{ color: infoExtra.color }}
            >
              {infoExtra.label}
            </span>
          </div>
          <div className="mt-4 p-5 bg-[#ecfdf5] rounded-[28px] border border-emerald-500/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-black text-emerald-800 uppercase italic">
                Nivel de llenado
              </span>
              <span className="text-lg font-black text-emerald-700 italic">
                {selectedPunto.nivelLlenado}%
              </span>
            </div>
            <div className="w-full bg-emerald-200/50 h-3 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${selectedPunto.nivelLlenado}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusItem = ({ color, label, count }) => (
  <li className="flex justify-between items-center group">
    <div className="flex items-center gap-4">
      <div
        className={`${color} w-3 h-3 rounded-full ring-4 ring-opacity-10 ring-current shadow-lg`}
      ></div>
      <span className="text-gray-500 font-bold italic text-[13px] group-hover:text-gray-800 transition-colors">
        {label} ({count})
      </span>
    </div>
  </li>
);

export default PanelStatus;
