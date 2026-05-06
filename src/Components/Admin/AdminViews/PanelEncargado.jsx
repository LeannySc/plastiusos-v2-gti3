import { useState } from "react";
import { Scale, Star, Loader2, CheckCircle, Package } from "lucide-react"; // Importé Package para los iconos
import { API_BASE_URL } from "../../../api/config";
import { toast, Toaster } from "sonner";

const PanelEncargado = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);

  // Datos del Pesaje
  const [searchEmail, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [kilos, setKilos] = useState("");

  // Catálogo de materiales local (Sincronizado con tus IDs de DB)
  const [materiales] = useState([
    { id: 1, nombre: "PLÁSTICO PET", pts: 15 },
    { id: 2, nombre: "VIDRIO", pts: 8 },
    { id: 3, nombre: "CARTÓN", pts: 10 },
  ]);

  const [selectedMat, setSelectedMat] = useState(null);

  // Cálculo dinámico de puntos
  const puntosCalculados =
    kilos > 0 && selectedMat ? Math.floor(kilos * selectedMat.pts) : 0;

  // 1. Identificar Ciudadano en la DB
  const buscarCiudadano = async () => {
    if (!searchEmail) {
      toast.warning("Por favor ingrese una identificación");
      return;
    }
    setBuscando(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/gestionar-usuarios`);
      const allUsers = await res.json();
      const found = allUsers.find(
        (u) => u.correo === searchEmail || u.id.toString() === searchEmail,
      );

      if (found && found.rol === "RECICLADOR") {
        setSelectedUser(found);
        toast.success("Ciudadano vinculado");
      } else {
        toast.error("El usuario no es un reciclador o no existe");
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error("Error de enlace con el servidor.", error);
    } finally {
      setBuscando(false);
    }
  };

  // 2. Procesar Envío Manual
  const procesarPesajeManual = async () => {
    // Validamos que TODO esté seleccionado
    if (!selectedUser) return toast.error("Debe vincular un ciudadano primero");
    if (!selectedMat)
      return toast.error("Debe seleccionar un tipo de material");
    if (kilos <= 0) return toast.error("Ingrese un peso válido mayor a 0");

    setLoading(true);
    const encargadoId = user?.id;
    const puntoVirtualId = 99; // Nuestro Nodo Maestro

    try {
      // ✅ ACTUALIZADO: URL con los 5 parámetros requeridos por tu TransaccionController
      const url = `${API_BASE_URL}/transacciones/entregar?userId=${selectedUser.id}&puntoId=${puntoVirtualId}&kilos=${kilos}&encargadoId=${encargadoId}&materialId=${selectedMat.id}`;

      const res = await fetch(url, { method: "POST" });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error en liquidación");
      }

      const data = await res.json();

      toast.success(
        `¡Sincronizado! +${data.puntosGanados} pts para ${selectedUser.nombre}`,
        {
          description: `Carga de ${selectedMat.nombre} registrada. Ticket: #${data.idTransaccion}`,
        },
      );

      // Limpieza UI Protocolaria
      setSelectedUser(null);
      setSelectedMat(null); // Reset del material
      setKilos("");
      setSearchTerm("");
    } catch (error) {
      toast.error("Fallo crítico: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <Toaster position="top-center" richColors />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-8">
        <div className="flex items-center gap-5">
          <div className="bg-[#a855f7] p-5 rounded-[28px] text-white shadow-xl rotate-3">
            <Scale size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black italic uppercase text-gray-900 tracking-tighter leading-none">
              Terminal Humana
            </h2>
            <p className="text-gray-400 font-bold italic uppercase text-[10px] mt-2 tracking-[0.2em]">
              Recolección Domiciliaria Popayán
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BLOQUE 1: IDENTIFICACIÓN */}
        <div className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-xl space-y-6">
          <h3 className="text-xs font-black text-gray-400 uppercase italic">
            1. Identificación
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Correo o ID..."
              value={searchEmail}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-5 bg-gray-50 rounded-[24px] outline-none font-black text-sm"
            />
            <button
              onClick={buscarCiudadano}
              className="bg-[#111827] text-white px-8 rounded-[24px] font-black uppercase text-[10px] tracking-widest active:scale-95"
            >
              {buscando ? <Loader2 className="animate-spin" /> : "Vincular"}
            </button>
          </div>

          {selectedUser && (
            <div className="p-6 bg-purple-50 rounded-[35px] border border-purple-100 flex justify-between items-center animate-in zoom-in">
              <div>
                <p className="text-[10px] font-black text-purple-400 uppercase">
                  Perfil Detectado
                </p>
                <h4 className="text-xl font-black italic text-purple-900 uppercase">
                  {selectedUser.nombre}
                </h4>
                <p className="text-[11px] text-purple-700 font-bold opacity-70 mt-1">
                  {selectedUser.correo}
                </p>
              </div>
              <CheckCircle className="text-purple-500" size={28} />
            </div>
          )}
        </div>

        {/* BLOQUE 2: CARGA Y MATERIAL */}
        <div className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-xl space-y-8">
          <h3 className="text-xs font-black text-gray-400 uppercase italic">
            2. Categoría de Residuo
          </h3>

          {/* SELECTOR VISUAL DE MATERIALES ✅ */}
          <div className="grid grid-cols-3 gap-3">
            {materiales.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMat(m)}
                className={`p-4 rounded-[22px] text-[9px] font-black transition-all border-2 flex flex-col items-center gap-2
                ${selectedMat?.id === m.id ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-gray-100 text-gray-400 hover:border-emerald-200"}`}
              >
                <Package size={20} />
                {m.nombre}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4">
              Peso detectado
            </label>
            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-[35px] focus-within:border-emerald-400 border-2 border-transparent transition-all">
              <input
                type="number"
                placeholder="0.00"
                value={kilos}
                onChange={(e) => setKilos(e.target.value)}
                className="bg-transparent w-full text-6xl font-black italic text-emerald-500 outline-none"
              />
              <span className="text-3xl font-black italic text-gray-300 uppercase underline decoration-emerald-500">
                kg
              </span>
            </div>
          </div>

          <div className="bg-[#ecfdf5] p-6 rounded-[30px] flex items-center justify-between border border-emerald-100">
            <Star className="text-emerald-500 fill-current" />
            <span className="text-4xl font-black italic text-emerald-600 tracking-tighter">
              +{puntosCalculados}{" "}
              <span className="text-xs font-medium uppercase">pts</span>
            </span>
          </div>

          <button
            disabled={loading || !selectedUser || !selectedMat}
            onClick={procesarPesajeManual}
            className="w-full py-6 bg-emerald-500 text-white rounded-full font-black uppercase text-[11px] tracking-[0.3em] shadow-xl hover:bg-emerald-600 transition-all disabled:opacity-30 disabled:grayscale"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Despachar Liquidación"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelEncargado;
