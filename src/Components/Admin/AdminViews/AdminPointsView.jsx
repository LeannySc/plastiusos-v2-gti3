import { useState, useEffect, useRef } from "react";
import {
  Plus,
  MapPin,
  Trash2,
  X,
  Database,
  AlertTriangle,
  EyeOff,
} from "lucide-react";
import { API_BASE_URL } from "../../../api/config";
import { toast, Toaster } from "sonner";

const AdminPointsView = () => {
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pointToDelete, setPointToDelete] = useState(null);
  const [showWithdrawAlert, setShowWithdrawAlert] = useState(false); // Sensor para el modal de bodega
  const [pointToWithdraw, setPointToWithdraw] = useState(null); // Memoria del nodo seleccionado

  const hasInitialized = useRef(false);

  const [newPunto, setNewPunto] = useState({
    nombre: "",
    direccion: "",
    codigoQR: "",
    latitud: 2.4419,
    longitud: -76.6063,
    capacidadMaximakg: 50.0,
    materialesIds: [],
  });

  // 📡 Radar de Sincronización
  const fetchPuntos = async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/puntos/todos`);
      const data = await res.json();
      setPuntos(data.filter((p) => p.activo === true));
    } catch (err) {
      toast.error("Radar GTI-3 fuera de línea.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      await Promise.resolve();
      try {
        const res = await fetch(`${API_BASE_URL}/puntos/todos`);
        const data = await res.json();
        if (activo) setPuntos(data.filter((p) => p.activo === true));
      } catch (err) {
        if (activo) toast.error("Error en enlace inicial.", err);
      } finally {
        if (activo) setLoading(false);
      }
    };
    cargar();
    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      isModalOpen || showConfirm ? "hidden" : "unset";
    if (!hasInitialized.current) {
      setAvailableMaterials([
        { id: 1, nombre: "PLÁSTICO PET" },
        { id: 2, nombre: "VIDRIO" },
        { id: 3, nombre: "CARTÓN" },
      ]);
      hasInitialized.current = true;
    }
  }, [isModalOpen, showConfirm]);

  const handleMaterialToggle = (id) => {
    setNewPunto((prev) => ({
      ...prev,
      materialesIds: prev.materialesIds.includes(id)
        ? prev.materialesIds.filter((mId) => mId !== id)
        : [...prev.materialesIds, id],
    }));
  };

  const handleAddPunto = async (e) => {
    e.preventDefault();
    if (newPunto.materialesIds.length === 0)
      return toast.warning("Selecciona materiales.");
    try {
      const res = await fetch(`${API_BASE_URL}/puntos/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPunto),
      });
      if (res.ok) {
        toast.success("EcoNodo Instalado");
        setIsModalOpen(false);
        resetForm();
        fetchPuntos();
      }
    } catch (err) {
      toast.error("Fallo de registro.", err);
    }
  };

  // ✅ BORRADO FÍSICO REAL (CONECTADO AL BOTÓN)
  const ejecutarBorradoReal = async () => {
    if (!pointToDelete) return;
    try {
      const res = await fetch(`${API_BASE_URL}/puntos/${pointToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Nodo Eliminado", {
          description: "Registro borrado de PostgreSQL.",
        });
        setShowConfirm(false);
        setPointToDelete(null);
        fetchPuntos(true);
      }
    } catch (err) {
      toast.error("Fallo al eliminar.", err);
    }
  };

  const confirmarMoverABodega = async () => {
    if (!pointToWithdraw) return;

    try {
      // ✅ Enviamos el objeto con el ID pero con la bandera ACTIVO en false
      const res = await fetch(`${API_BASE_URL}/puntos/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pointToWithdraw, activo: false }),
      });

      if (res.ok) {
        toast.success(`Nodo ${pointToWithdraw.nombre} en Bodega`, {
          description: "Sincronizado con éxito con la reserva técnica.",
        });
        setShowWithdrawAlert(false);
        setPointToWithdraw(null);
        fetchPuntos(); // Refrescamos el radar (el nodo desaparecerá de aquí)
      }
    } catch (err) {
      toast.error("Error en la terminal de comunicaciones GTI.", err);
    }
  };

  const resetForm = () => {
    setNewPunto({
      nombre: "",
      direccion: "",
      codigoQR: "",
      latitud: 2.4419,
      longitud: -76.6063,
      capacidadMaximakg: 50.0,
      materialesIds: [],
    });
  };

  if (loading && puntos.length === 0)
    return (
      <div className="p-20 text-center animate-pulse">
        <Database className="text-emerald-500 mx-auto mb-4" size={40} />
        <p className="font-black italic text-gray-400 text-xs">
          SINCRONIZANDO GTI-3...
        </p>
      </div>
    );

  return (
    <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm space-y-8 animate-in fade-in duration-700">
      <Toaster richColors position="top-right" />

      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-gray-50 pb-6">
        <div>
          <h3 className="text-3xl font-black italic text-gray-900 uppercase tracking-tighter leading-none">
            Estaciones IoT
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">
            Popayán - Terminal de Infraestructura
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#10b981] text-white px-8 py-4 rounded-3xl font-black italic text-[11px] uppercase shadow-lg active:scale-95 transition-all"
        >
          <Plus size={18} /> Agregar Nodo
        </button>
      </div>

      {/* LISTADO */}
      <div className="grid grid-cols-1 gap-4">
        {puntos.map((p) => (
          <div
            key={p.id}
            className="group flex items-center justify-between p-6 bg-gray-50/40 border border-gray-100 rounded-[40px] hover:border-emerald-100 hover:bg-white transition-all shadow-sm"
          >
            <div className="flex items-center gap-6">
              <div
                className={`p-4 rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-100`}
              >
                <MapPin size={26} />
              </div>
              <div>
                <h4 className="font-black italic text-gray-800 uppercase text-lg leading-none">
                  {p.nombre}
                </h4>
                <p className="text-[11px] text-gray-400 font-bold mt-1 uppercase italic">
                  {p.direccion}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* ✅ BOTON DE ESTADO (Ahora usa toggleEstado para que no dé error) */}
              <button
                onClick={() => {
                  setPointToWithdraw(p); // Cargamos el nodo en memoria
                  setShowWithdrawAlert(true); // Abrimos la advertencia
                }}
                className="px-6 py-2.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
              >
                ● Online
              </button>
              {/* 🗑️ BOTON BASURA */}
              <button
                onClick={() => {
                  setPointToDelete(p.id);
                  setShowConfirm(true);
                }}
                className="p-3 bg-white text-gray-200 hover:text-red-500 border border-gray-50 rounded-xl transition-all shadow-sm"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL SIN LÍNEAS NEGRAS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative bg-white w-full max-w-2xl rounded-[55px] shadow-xl flex flex-col max-h-[92vh] overflow-hidden">
            <div className="p-8 border-b border-gray-100/50 bg-gray-50/50 flex justify-between items-start">
              <h2 className="text-4xl font-black italic text-gray-900 uppercase tracking-tighter leading-none">
                ALTA ESTACIÓN GTI-3
              </h2>

              <div className="flex items-start gap-6">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic mt-3">
                  INTRODUCE LAS ESPECIFICACIONES DE HARDWARE
                </p>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-white shadow-sm border border-gray-100 text-gray-400 rounded-full hover:rotate-90 transition-all duration-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-10 overflow-y-auto custom-scrollbar flex-grow space-y-10 pt-4">
              <form
                onSubmit={handleAddPunto}
                id="nodeForm"
                className="space-y-8"
              >
                {/* --- FILA 1 --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PointInput
                    label="Identidad Estación"
                    placeholder="Ej: EcoNodo Galería"
                    value={newPunto.nombre}
                    onChange={(v) => setNewPunto({ ...newPunto, nombre: v })}
                  />
                  <PointInput
                    label="Localización / Barrio"
                    placeholder="Ej: Barrio Bolivar"
                    value={newPunto.direccion}
                    onChange={(v) => setNewPunto({ ...newPunto, direccion: v })}
                  />
                </div>

                {/* --- FILA 2 --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PointInput
                    label="Capacidad Máxima (Kg)"
                    type="number"
                    value={newPunto.capacidadMaximakg}
                    onChange={(v) =>
                      setNewPunto({
                        ...newPunto,
                        capacidadMaximakg: parseFloat(v),
                      })
                    }
                  />
                  <PointInput
                    label="ID Token QR"
                    placeholder="GAL-POP-001"
                    value={newPunto.codigoQR}
                    onChange={(v) => setNewPunto({ ...newPunto, codigoQR: v })}
                  />
                </div>

                {/* --- BLOQUE GPS --- */}
                <div className="bg-[#f0fdf4] p-10 rounded-[45px] border border-emerald-100 space-y-6">
                  <p className="text-[10px] font-black uppercase text-emerald-700 italic tracking-[0.2em] flex items-center gap-3">
                    Sincronización GPS Atómica
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* --- MATERIALES --- */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {availableMaterials.map((mat) => (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => handleMaterialToggle(mat.id)}
                      className={`px-8 py-5 rounded-[22px] text-[11px] font-black uppercase transition-all border shadow-lg ${
                        newPunto.materialesIds.includes(mat.id)
                          ? "bg-[#10b981] text-white"
                          : "bg-gray-50 text-gray-300"
                      }`}
                    >
                      {mat.nombre}
                    </button>
                  ))}
                </div>
              </form>
            </div>
            <div className="p-10">
              <button
                form="nodeForm"
                type="submit"
                className="w-full py-6 bg-[#111827] text-white rounded-[28px] font-black uppercase text-[12px] tracking-[0.4em] shadow-xl hover:bg-[#10b981] transition-all"
              >
                DESPLEGAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL CONFIRMACION */}
      {showConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          ></div>
          <div className="relative bg-white p-12 rounded-[50px] shadow-2xl max-w-sm w-full text-center">
            <div className="bg-red-50 text-red-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-3xl font-black italic uppercase leading-none mb-3">
              ¿ELIMINAR NODO?
            </h3>
            <p className="text-gray-400 text-[10px] font-bold uppercase mb-10">
              Se borrará permanentemente de Postgres.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="py-4 bg-gray-50 text-gray-400 rounded-3xl font-black text-[10px]"
              >
                Pausar
              </button>
              <button
                onClick={ejecutarBorradoReal}
                className="py-4 bg-red-500 text-white rounded-3xl font-black text-[10px] shadow-lg shadow-red-200"
              >
                BORRAR
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 📦 MODAL DE MOVIMIENTO A BODEGA */}
      {showWithdrawAlert && pointToWithdraw && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowWithdrawAlert(false)}
          ></div>
          <div className="relative bg-white p-12 rounded-[55px] shadow-2xl max-w-sm w-full text-center border border-gray-100">
            <div className="bg-indigo-50 text-indigo-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse">
              <EyeOff size={45} />
            </div>

            {/* Nombre del nodo inyectado aquí ⬇️ */}
            <h3 className="text-3xl font-black italic uppercase leading-tight text-gray-900">
              ¿Mover {pointToWithdraw.nombre} a Bodega?
            </h3>

            <p className="text-gray-400 text-[10px] font-bold mt-4 mb-10 italic uppercase leading-relaxed px-4">
              Al aceptar, la estación se desactivará del mapa público para
              mantenimiento o reubicación técnica.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowWithdrawAlert(false)}
                className="py-5 bg-gray-50 text-gray-400 rounded-3xl font-black uppercase text-[9px] tracking-[0.2em] hover:bg-gray-100 transition-colors"
              >
                CANCELAR
              </button>
              <button
                onClick={confirmarMoverABodega}
                className="py-5 bg-[#111827] text-white rounded-3xl font-black uppercase text-[9px] tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-600 transition-all active:scale-95"
              >
                SÍ, TRASLADAR
              </button>
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
  <div className="space-y-2 text-left flex-grow">
    <label className="text-[10px] font-black uppercase text-gray-300 ml-4 italic tracking-tight">
      {label}
    </label>
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={step}
        className="w-full bg-gray-50 border border-gray-100 rounded-[28px] px-8 py-5 text-sm font-bold text-gray-800 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-gray-300 placeholder:italic shadow-inner group-hover:border-gray-200"
      />
    </div>
  </div>
);

export default AdminPointsView;
