import { useState, useEffect } from "react";
import { Plus, MapPin, Eye, Trash2, X, Navigation } from "lucide-react";
import { API_BASE_URL } from "../../../api/config";
import { toast, Toaster } from "sonner";

const AdminPointsView = () => {
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Datos para nuevo punto (Atómicos para el mapa de Popayán)
  const [newPunto, setNewPunto] = useState({
    nombre: "",
    direccion: "",
    codigoQR: "",
    latitud: 2.4419, // Default Centro
    longitud: -76.6063,
    activo: true,
    capacidadMaximakg: 50.0,
    estadoBote: "VACÍO",
  });

  const fetchPuntos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/puntos/todos`);
      const data = await res.json();
      setPuntos(data);
    } catch (err) {
      toast.error("Error al sincronizar red de puntos", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/puntos/todos`);
        const data = await res.json();
        setPuntos(data);
      } catch (err) {
        toast.error("Error al sincronizar red de puntos", {
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);
  // 🔥 1. Función para Toggle Mantenimiento (Activar/Desactivar)
  const toggleEstado = async (punto) => {
    const actualizado = { ...punto, activo: !punto.activo };
    try {
      const res = await fetch(`${API_BASE_URL}/puntos/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actualizado),
      });
      if (res.ok) {
        toast.info(
          actualizado.activo ? "Bote Reestablecido" : "Punto en Mantenimiento",
        );
        fetchPuntos();
      }
    } catch (err) {
      toast.error("Error de conexión", { description: err.message });
    }
  };

  // 🔥 2. Registro de nuevo Nodo
  const handleAddPunto = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/puntos/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPunto),
      });
      if (res.ok) {
        toast.success("Nuevo Punto Desplegado en Popayán");
        setIsModalOpen(false);
        fetchPuntos();
      }
    } catch (err) {
      toast.error("Error al registrar punto", { description: err.message });
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-black text-gray-300">
        Escaneando red industrial...
      </div>
    );

  return (
    <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm space-y-8 animate-in fade-in duration-700">
      <Toaster richColors />

      {/* HEADER DINÁMICO */}
      <div className="flex justify-between items-center border-b border-gray-50 pb-6">
        <div>
          <h3 className="text-2xl font-black italic text-gray-900 uppercase tracking-tighter">
            Red de Puntos
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Gestión de Botes e infraestructura IoT
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#10b981] text-white px-8 py-4 rounded-3xl font-black italic text-[11px] uppercase tracking-widest hover:bg-emerald-600 shadow-lg active:scale-95 transition-all"
        >
          <Plus size={18} strokeWidth={3} /> Agregar Nodo
        </button>
      </div>

      {/* LISTADO DE INFRAESTRUCTURA */}
      <div className="space-y-4">
        {puntos.map((p) => (
          <div
            key={p.id}
            className="group flex items-center justify-between p-6 bg-gray-50/40 border border-gray-100 rounded-[35px] hover:border-emerald-100 hover:bg-white transition-all shadow-sm"
          >
            <div className="flex items-center gap-5">
              <div
                className={`p-4 rounded-2xl ${p.activo ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : "bg-gray-100 text-gray-400"}`}
              >
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-black italic text-gray-800 uppercase text-lg leading-none">
                  {p.nombre}
                </h4>
                <p className="text-[11px] text-gray-400 font-bold mt-1 uppercase italic tracking-wider">
                  {p.direccion}
                </p>
                <p className="text-[9px] text-gray-300 font-bold mt-1">
                  Coordenadas: {p.latitud}, {p.longitud}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleEstado(p)}
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase italic transition-all
                  ${
                    p.activo
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                      : "bg-gray-200 text-gray-400 border border-transparent hover:bg-emerald-100 hover:text-emerald-600"
                  }`}
              >
                {p.activo ? "● Activo" : "○ En Mantenimiento"}
              </button>
              <button className="p-3 bg-white text-gray-400 rounded-xl shadow-sm hover:text-indigo-500 border border-gray-50">
                <Eye size={16} />
              </button>
              <button className="p-3 bg-white text-gray-400 rounded-xl shadow-sm hover:text-red-500 border border-gray-50">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🚀 MODAL DE ALTA DE PUNTO GTI-3 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[45px] shadow-2xl border border-white overflow-hidden">
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <h2 className="text-3xl font-black italic text-gray-900 uppercase tracking-tighter">
                  Instalar Nuevo Nodo
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleAddPunto} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <PointInput
                    label="Identidad Estación"
                    placeholder="Ej: EcoNodo San José"
                    value={newPunto.nombre}
                    onChange={(v) => setNewPunto({ ...newPunto, nombre: v })}
                  />
                  <PointInput
                    label="Localización / Barrio"
                    placeholder="Ej: Calle 4 #5-2"
                    value={newPunto.direccion}
                    onChange={(v) => setNewPunto({ ...newPunto, direccion: v })}
                  />
                </div>

                <div className="bg-[#f0fdf4] p-6 rounded-[35px] border border-emerald-100 space-y-4">
                  <div className="flex items-center gap-2 mb-2 text-emerald-600">
                    <Navigation size={14} className="font-bold" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">
                      Coordenadas del Mapa (Atómico)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <PointInput
                      label="Latitud"
                      type="number"
                      step="0.0001"
                      value={newPunto.latitud}
                      onChange={(v) =>
                        setNewPunto({ ...newPunto, latitud: parseFloat(v) })
                      }
                    />
                    <PointInput
                      label="Longitud"
                      type="number"
                      step="0.0001"
                      value={newPunto.longitud}
                      onChange={(v) =>
                        setNewPunto({ ...newPunto, longitud: parseFloat(v) })
                      }
                    />
                  </div>
                </div>

                <PointInput
                  label="Token QR de Bote"
                  placeholder="GTI-POPAYAN-XX"
                  value={newPunto.codigoQR}
                  onChange={(v) => setNewPunto({ ...newPunto, codigoQR: v })}
                />

                <button
                  type="submit"
                  className="w-full py-5 bg-[#111827] text-white rounded-[25px] font-black italic uppercase text-xs tracking-widest hover:bg-[#10b981] transition-all shadow-xl"
                >
                  Dar de alta en la red GTI-3
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PointInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
}) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 italic tracking-widest">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      step={step}
      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 focus:bg-white focus:border-emerald-500 outline-none transition-all shadow-sm"
    />
  </div>
);

export default AdminPointsView;
