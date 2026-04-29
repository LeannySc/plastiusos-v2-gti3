import { useState, useEffect } from "react";
import MapaComando from "./Home/MapaComando";
import PanelStatus from "./Home/PanelStatus";
import { LayoutDashboard, Database } from "lucide-react";
import { API_BASE_URL } from "../api/config";

const ModuloInicio = () => {
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 ARQUITECTURA REPARADA: useEffect de Sincronización Única
  useEffect(() => {
    let isMounted = true; // Protocolo de seguridad: Evita actualizaciones en componentes desmontados

    const cargarTelemetria = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/puntos/todos`);
        const data = await res.json();

        if (isMounted) {
          setPuntos(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Fallo crítico en el túnel hacia Java:", error);
        if (isMounted) setLoading(false);
      }
    };

    // 1. Ejecución inicial (Desacoplada del cuerpo del render)
    cargarTelemetria();

    // 2. Sistema de Industrial Sync (Cada 30 seg)
    const interval = setInterval(cargarTelemetria, 30000);

    // 3. Limpieza de protocolo (Clean-up function)
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []); // El array vacío asegura que esto solo inicie una vez

  // --- UI DE CARGA (GTI STYLE) ---
  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f9fafb]">
        <Database className="text-emerald-500 animate-bounce mb-4" size={60} />
        <p className="font-black italic text-gray-400 tracking-widest uppercase">
          Escaneando red industrial local...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-12">
      {/* 🟢 HERO GTI-3 */}
      <div className="bg-[#10b981] rounded-[45px] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.85] mb-2">
            GTI-3 COMANDO
          </h1>
          <p className="mt-2 text-emerald-50 text-xl font-medium max-w-xl italic opacity-90 tracking-tight">
            Nodos locales vinculados exitosamente a Postgres.
          </p>
        </div>
        <LayoutDashboard
          className="absolute -right-16 -bottom-16 text-emerald-400 opacity-20 rotate-12 scale-110"
          size={350}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Contenedor del Mapa XL */}
        <div className="w-full lg:w-[72%]">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
            <h2 className="text-xl font-black text-gray-800 italic uppercase">
              Monitor en Tiempo Real
            </h2>
          </div>
          <div className="h-[700px] shadow-2xl rounded-[45px] overflow-hidden border-4 border-white">
            {/* Enviamos los datos reales capturados de Java */}
            <MapaComando
              onSelectPunto={setPuntoSeleccionado}
              puntosData={puntos}
            />
          </div>
        </div>

        {/* Panel lateral con contadores reales */}
        <div className="w-full lg:w-[28%] pt-20">
          <PanelStatus selectedPunto={puntoSeleccionado} listaPuntos={puntos} />
        </div>
      </div>
    </div>
  );
};

export default ModuloInicio;
