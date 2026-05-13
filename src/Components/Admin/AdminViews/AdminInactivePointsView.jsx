import { useState, useEffect, useRef } from "react";
import { RefreshCcw, Database } from "lucide-react";
import { API_BASE_URL } from "../../../api/config";
import { toast, Toaster } from "sonner";

const AdminInactivePointsView = () => {
  const [inactivos, setInactivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null); // Para el modal de reubicación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchInactivosRef = useRef(null);

  useEffect(() => {
    // ✅ Función definida DENTRO del efecto → el linter no se queja
    const fetchInactivos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/puntos/retirados`);
        const data = await res.json();
        setInactivos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fallo de conexión bodega:", err);
        setInactivos([]); // En caso de error, lista vacía para que no explote
      } finally {
        setLoading(false);
      }
    };

    // Guardamos la referencia para usarla fuera del efecto
    fetchInactivosRef.current = fetchInactivos;

    fetchInactivos();
  }, []); // ✅ Array vacío limpio, sin advertencias

  const handleReinstalar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${API_BASE_URL}/puntos/reinstalar/${selectedPoint.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedPoint),
        },
      );
      if (res.ok) {
        toast.success("Nodo Re-ubicado en Mapa");
        setIsModalOpen(false);
        fetchInactivosRef.current?.(); // ✅ Llama el fetch sin violar reglas de hooks
      }
    } catch (err) {
      toast.error("Error en despliegue técnico.", err);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse">
        Consultando Bodega GTI-3...
      </div>
    );

  return (
    <div className="bg-white p-8 rounded-[45px] border border-gray-100 space-y-8 animate-in fade-in duration-700">
      <Toaster richColors position="top-right" />
      <div>
        <h3 className="text-3xl font-black italic uppercase tracking-tighter">
          Bodega Técnica
        </h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase italic">
          Hardware retirado de la red pública
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {inactivos.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-6 bg-indigo-50/30 rounded-[35px] border border-indigo-100 border-dashed"
          >
            <div className="flex items-center gap-6">
              <div className="p-4 bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-100">
                <Database size={24} />
              </div>
              <div>
                <h4 className="font-black italic text-gray-800 uppercase">
                  {p.nombre}
                </h4>
                <p className="text-[10px] text-gray-400 font-bold">
                  SERIAL QR: {p.codigoQR}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedPoint(p);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-[#111827] text-white px-6 py-3 rounded-2xl font-black italic uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
            >
              <RefreshCcw size={14} /> Reinstalar
            </button>
          </div>
        ))}
        {inactivos.length === 0 && (
          <p className="text-center py-20 text-gray-300 font-black italic uppercase text-xs">
            No hay botes en reserva técnica
          </p>
        )}
      </div>

      {/* 🛠️ MODAL DE REINSTALACION DINÁMICO */}
      {isModalOpen && selectedPoint && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-in fade-in">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-xl rounded-[50px] p-12 shadow-2xl">
            <h2 className="text-2xl font-black italic text-gray-900 uppercase mb-8 text-center">
              Nueva Ubicación para Bote #{selectedPoint.id}
            </h2>
            <form onSubmit={handleReinstalar} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4">
                  Nombre Estación (Nueva zona)
                </label>
                <input
                  className="w-full bg-gray-50 border p-5 rounded-3xl outline-none"
                  value={selectedPoint.nombre}
                  onChange={(e) =>
                    setSelectedPoint({
                      ...selectedPoint,
                      nombre: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4">
                  Localización Nueva (Calle/Barrio)
                </label>
                <input
                  className="w-full bg-gray-50 border p-5 rounded-3xl outline-none"
                  value={selectedPoint.direccion}
                  onChange={(e) =>
                    setSelectedPoint({
                      ...selectedPoint,
                      direccion: e.target.value,
                    })
                  }
                />
              </div>
              {/* ✅ ZONA GPS ATÓMICA RECARGADA */}
              <div className="bg-[#f0fdf4] p-6 rounded-[35px] border border-emerald-100 grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-emerald-700 ml-4 italic">
                    Latitud
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    className="w-full bg-white border border-emerald-100 p-4 rounded-2xl outline-none text-xs font-bold"
                    value={selectedPoint.latitud}
                    onChange={(e) =>
                      setSelectedPoint({
                        ...selectedPoint,
                        latitud: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-emerald-700 ml-4 italic">
                    Longitud
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    className="w-full bg-white border border-emerald-100 p-4 rounded-2xl outline-none text-xs font-bold"
                    value={selectedPoint.longitud}
                    onChange={(e) =>
                      setSelectedPoint({
                        ...selectedPoint,
                        longitud: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-6 bg-emerald-500 text-white rounded-full font-black uppercase text-[10px] shadow-xl hover:bg-emerald-600 transition-all"
              >
                Sincronizar y Desplegar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInactivePointsView;
