import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Package,
  Star,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import { API_BASE_URL } from "../../../api/config";
import { toast, Toaster } from "sonner";

const AdminCatalogView = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [currentProducto, setCurrentProducto] = useState({
    nombre: "",
    descripcion: "",
    costoPuntos: 0,
    stock: 0,
    imagenUrl: "",
    activo: true,
  });

  // 🔥 PROTOCOLO GTI-3: Sincronización Protegida
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/productos/todos`);
        const data = await res.json();
        if (isMounted) {
          setProductos(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Fallo de conexión industrial:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Lógica de Sincronización Manual (Refresco)
  const refreshInventario = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/productos/todos`);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      toast.error("Protocolo de refresco fallido", { description: err.message });
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const isEdit = currentProducto.id !== undefined;
    const url = isEdit
      ? `${API_BASE_URL}/admin/productos/${currentProducto.id}`
      : `${API_BASE_URL}/admin/productos`;

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProducto),
      });

      if (res.ok) {
        toast.success(isEdit ? "Producto Actualizado" : "Producto Registrado");
        setModalOpen(false);
        refreshInventario(); // 🛰️ Refresco dinámico
      }
    } catch (err) {
      toast.error("Error crítico en escritura SQL", { description: err.message });
    }
  };

  const abrirEditor = (prod = null) => {
    if (prod) setCurrentProducto(prod);
    else
      setCurrentProducto({
        nombre: "",
        descripcion: "",
        costoPuntos: 0,
        stock: 0,
        imagenUrl: "",
        activo: true,
      });
    setModalOpen(true);
  };

  if (loading)
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center space-y-4 bg-white rounded-[45px] border">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
        <p className="font-black italic text-gray-400 uppercase tracking-widest text-xs">
          Accediendo a Bóveda de Productos...
        </p>
      </div>
    );

  return (
    <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm space-y-8 animate-in fade-in duration-700">
      <Toaster richColors position="top-right" />

      {/* HEADER DE CONTROL */}
      <div className="flex justify-between items-center border-b border-gray-50 pb-6">
        <div>
          <h3 className="text-2xl font-black italic text-gray-900 uppercase tracking-tighter">
            Almacén GTI-3
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase italic">
            Inventario de Recompensas · Popayán Local
          </p>
        </div>
        <button
          onClick={() => abrirEditor()}
          className="flex items-center gap-2 bg-[#10b981] text-white px-8 py-4 rounded-3xl font-black italic text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Agregar Material
        </button>
      </div>

      {/* GRID DE PRODUCTOS REALES */}
      <div className="grid grid-cols-1 gap-4">
        {productos.map((prod) => (
          <div
            key={prod.id}
            className="group flex items-center justify-between p-6 bg-gray-50/50 border border-gray-100 rounded-[35px] hover:border-emerald-500/20 hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-500/5"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center shrink-0">
                {prod.imagenUrl ? (
                  <img
                    src={prod.imagenUrl}
                    className="w-full h-full object-cover"
                    alt={prod.nombre}
                  />
                ) : (
                  <ImageIcon className="text-gray-200" size={32} />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-black italic text-gray-800 uppercase text-lg leading-tight tracking-tight">
                  {prod.nombre}
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase">
                    <Package size={12} /> Stock: {prod.stock}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 italic">
                    <Star size={12} fill="currentColor" /> {prod.costoPuntos}{" "}
                    pts
                  </span>
                  <div
                    className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${prod.activo ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"}`}
                  >
                    {prod.activo ? "Disponible" : "Oculto"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => abrirEditor(prod)}
                className="p-3.5 bg-white rounded-2xl text-gray-400 hover:text-emerald-500 shadow-sm border border-gray-100 transition-all"
              >
                <Edit2 size={18} />
              </button>
              <button className="p-3.5 bg-white rounded-2xl text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {productos.length === 0 && (
          <div className="text-center py-20 text-gray-300 font-black italic uppercase tracking-[0.2em]">
            Cargando red de datos...
          </div>
        )}
      </div>

      {/* 🚀 MODAL ADMIN MAESTRO */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[45px] shadow-2xl border border-gray-100">
            <div className="p-12 space-y-8">
              <div className="flex justify-between items-start">
                <h2 className="text-3xl font-black italic text-gray-900 uppercase tracking-tighter">
                  {currentProducto.id
                    ? "Ajustar Material"
                    : "Alta de Recompensa"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleGuardar} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <InputAdmin
                    label="Identidad Producto"
                    value={currentProducto.nombre}
                    onChange={(v) =>
                      setCurrentProducto({ ...currentProducto, nombre: v })
                    }
                  />
                  <InputAdmin
                    label="Capa Visual (URL)"
                    value={currentProducto.imagenUrl}
                    onChange={(v) =>
                      setCurrentProducto({ ...currentProducto, imagenUrl: v })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                    Ficha Descriptiva
                  </label>
                  <textarea
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 focus:bg-white outline-none"
                    rows="2"
                    value={currentProducto.descripcion}
                    onChange={(e) =>
                      setCurrentProducto({
                        ...currentProducto,
                        descripcion: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <InputAdmin
                    label="Liquidación (Pts)"
                    type="number"
                    value={currentProducto.costoPuntos}
                    onChange={(v) =>
                      setCurrentProducto({
                        ...currentProducto,
                        costoPuntos: parseInt(v),
                      })
                    }
                  />
                  <InputAdmin
                    label="Cargas Disponibles"
                    type="number"
                    value={currentProducto.stock}
                    onChange={(v) =>
                      setCurrentProducto({
                        ...currentProducto,
                        stock: parseInt(v),
                      })
                    }
                  />
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 text-center tracking-tighter italic">
                      Status Red
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentProducto({
                          ...currentProducto,
                          activo: !currentProducto.activo,
                        })
                      }
                      className={`flex-grow rounded-2xl text-[9px] font-black uppercase italic transition-all ${currentProducto.activo ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-500 border border-red-100"}`}
                    >
                      {currentProducto.activo ? "En Vitrina" : "No Visible"}
                    </button>
                  </div>
                </div>
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full py-5 bg-[#111827] text-white rounded-[24px] font-black italic uppercase text-xs tracking-widest hover:bg-emerald-500 shadow-xl transition-all active:scale-95"
                  >
                    Sincronizar Almacén
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputAdmin = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-1 text-left">
    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 italic tracking-widest">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 outline-none focus:border-emerald-500 transition-all"
    />
  </div>
);

export default AdminCatalogView;
