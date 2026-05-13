import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  User,
  Phone,
  QrCode,
  Navigation2,
  Database,
  Layers,
} from "lucide-react";
import { API_BASE_URL } from "../api/config";

const PuntosRecoleccion = () => {
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // Estados para los filtros (Cerebro del buscador)
  const [searchTerm, setSearchTerm] = useState("");
  const [soloActivos, setSoloActivos] = useState(false);
  const [filtroMaterial, setFiltroMaterial] = useState("Todos los materiales");

  // 🔥 EFECTO 1: Carga inicial desde Java
  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/puntos/todos`);
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setPuntos(data);
        } else {
          setPuntos([]); // 🛡️ evita que explote el filter
          console.error("Fallo de telemetría:", data);
        }
      } catch (err) {
        console.error("Fallo al conectar con PuntoController:", err);
        setPuntos([]); // también protegemos aquí
      } finally {
        setLoading(false);
      }
    };

    fetchPuntos();
  }, []);

  // 🔥 LÓGICA DE FILTRADO MULTI-CRITERIO MEJORADA
  const puntosFiltrados = puntos.filter((punto) => {
    const matchesSearch =
      punto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      punto.direccion.toLowerCase().includes(searchTerm.toLowerCase());

    // ✅ Si 'soloActivos' es true, ocultamos los que son false.
    // ✅ Si 'soloActivos' es false, mostramos absolutamente TODO.
    const matchesStatus = soloActivos ? punto.activo === true : true;

    const matchesMaterial =
      filtroMaterial === "Todos los materiales" ||
      punto.materiales?.some((m) => m.nombre === filtroMaterial);

    return matchesSearch && matchesStatus && matchesMaterial;
  });

  // Cálculo dinámico para las Stat Cards
  const stats = {
    total: puntos.length,
    activos: puntos.filter((p) => p.activo).length,
    inactivos: puntos.filter((p) => !p.activo).length,
    materiales: [
      ...new Set(
        puntos.flatMap((p) => p.materiales?.map((m) => m.nombre) || []),
      ),
    ].length,
  };

  if (loading)
    return (
      <div className="h-[600px] flex flex-col items-center justify-center space-y-4">
        <Database className="animate-spin text-emerald-500" size={48} />
        <p className="font-black italic text-gray-400 uppercase tracking-widest">
          Sincronizando Nodos GTI...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* 🟢 HEADER DE SECCIÓN */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
          Puntos de Recolección
        </h1>
        <p className="text-gray-500 mt-2 font-medium italic">
          Telemetría en vivo desde las estaciones industriales de Popayán.
        </p>
      </div>

      {/* 📊 MÉTRICAS DINÁMICAS (DATOS DE DB) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          value={stats.total}
          label="Total Puntos"
          color="text-gray-900"
        />
        <StatCard
          value={stats.activos}
          label="Activos"
          color="text-emerald-500"
        />
        <StatCard
          value={stats.inactivos}
          label="Inactivos"
          color="text-red-500"
        />
        <StatCard
          value={stats.materiales}
          label="Tipos Material"
          color="text-blue-500"
        />
      </div>

      {/* 🔍 BARRA DE BÚSQUEDA Y FILTROS VINCULADA */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-5 rounded-[35px] border border-gray-100 shadow-sm">
        <div className="relative flex-grow group w-full">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o dirección..."
            className="w-full pl-14 pr-6 py-4 rounded-3xl bg-gray-50 border-none outline-none font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* Toggle Activos */}
          <button
            onClick={() => setSoloActivos(!soloActivos)}
            className={`flex items-center gap-3 px-6 py-4 rounded-3xl font-black italic uppercase text-[10px] tracking-widest border transition-all
            ${soloActivos ? "bg-gray-900 text-white border-gray-900" : "bg-gray-50 text-gray-600 border-transparent hover:border-emerald-200"}`}
          >
            <div
              className={`w-8 h-4 rounded-full p-1 transition-colors ${soloActivos ? "bg-emerald-500" : "bg-gray-300"}`}
            >
              <div
                className={`w-2 h-2 bg-white rounded-full transition-transform ${soloActivos ? "translate-x-4" : "translate-x-0"}`}
              />
            </div>
            Solo activos
          </button>

          <div className="relative">
            <select
              onChange={(e) => setFiltroMaterial(e.target.value)}
              className="appearance-none px-8 py-4 pr-12 rounded-3xl bg-gray-50 border-none outline-none font-black italic text-[10px] uppercase tracking-widest text-gray-700 cursor-pointer"
            >
              <option>Todos los materiales</option>
              <option>Plástico PET</option>
              <option>Vidrio</option>
              <option>Cartón</option>
              <option>Papel</option>
            </select>
            <Layers
              size={14}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* 📋 GRID DE TARJETAS (PUNTOS REALES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {puntosFiltrados.map((punto) => (
          <PuntoCard
            key={punto.id}
            punto={punto}
            isSelected={selectedId === punto.id}
            onSelect={() =>
              setSelectedId(selectedId === punto.id ? null : punto.id)
            }
          />
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---

const StatCard = ({ value, label, color }) => (
  <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center space-y-1">
    <span className={`text-5xl font-black italic tracking-tighter ${color}`}>
      {value}
    </span>
    <span className="text-gray-400 font-black uppercase tracking-[0.2em] text-[9px]">
      {label}
    </span>
  </div>
);

const PuntoCard = ({ punto, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`relative bg-white p-7 rounded-[45px] border-2 transition-all duration-500 cursor-pointer
      ${isSelected ? "border-emerald-500 shadow-xl scale-[1.02]" : "border-transparent shadow-sm hover:border-gray-200"}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-4 rounded-3xl transition-colors ${punto.activo ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"}`}
        >
          <MapPin size={24} fill="currentColor" fillOpacity={0.2} />
        </div>
        <span
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
          ${punto.activo ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${punto.activo ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
          ></div>
          {punto.activo ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div>
        <h3 className="text-2xl font-black tracking-tight leading-none italic uppercase text-gray-900">
          {punto.nombre}
        </h3>
        <p className="text-gray-400 text-sm font-medium mt-1">
          {punto.direccion}
        </p>
      </div>

      <div className="space-y-3 mt-6">
        <div className="flex items-center gap-3 text-gray-500 text-[13px] font-semibold italic">
          <Clock size={16} className="text-emerald-500/50" />{" "}
          <span>Llamada Industrial disp.</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500 text-[13px] font-semibold italic">
          <User size={16} className="text-emerald-500/50" />{" "}
          <span>Estación: #00{punto.id}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        {punto.materiales?.map((m, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[9px] font-black uppercase tracking-tighter border border-gray-100"
          >
            {m.nombre}
          </span>
        ))}
      </div>

      {/* PANEL EXPANDIBLE (DINÁMICO SEGUN JAVA ID) */}
      <div
        className={`space-y-4 overflow-hidden transition-all duration-700 ${isSelected ? "max-h-[300px] opacity-100 pt-6 mt-6 border-t" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-emerald-50/80 flex items-center gap-3 px-5 py-4 rounded-[24px] border border-emerald-100">
          <QrCode size={20} className="text-emerald-500" />
          <div>
            <span className="text-[10px] font-black text-emerald-800 italic uppercase block leading-none">
              Código QR de Escaneo
            </span>
            <span className="text-[9px] text-emerald-600/70 font-bold uppercase tracking-widest">
              {punto.codigoQR || "GTI-LOCAL-TOKEN"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-4 rounded-[22px] font-black italic uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all">
            <Navigation2 size={16} /> Cómo llegar
          </button>
          <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-4 rounded-[22px] font-black italic uppercase text-[10px] tracking-widest hover:bg-gray-200">
            <Phone size={16} /> Llamar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PuntosRecoleccion;
