import { useState, useEffect, useCallback, useRef } from "react"; // ⬅️ Añadimos useRef
import { Navigation, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "../../../api/config";
import { toast, Toaster } from "sonner";

const VistaMisiones = ({ user }) => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false); // 🟢 Cambiamos a false inicialmente
  const [misionActiva, setMisionActiva] = useState(null);
  const [procesando, setProcesando] = useState(false);

  // 🔥 Ref para evitar múltiples disparos iniciales
  const inicializado = useRef(false);

  const cargarMisionesCercanas = useCallback(async (silencioso = false) => {
    // Solo mostramos loading si no es una actualización en segundo plano
    if (!silencioso) setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/logistica/botes-cercanos?lat=2.4419&lon=-76.6063`,
      );
      const data = await res.json();
      setAlertas(data);
    } catch (err) {
      console.error("Error en enlace de telemetría:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const iniciarCarga = async () => {
      // Pequeño delay de microtask para que React termine su ciclo de montado
      // Esto elimina el error de "setState synchronously"
      await Promise.resolve();
      if (isMounted) {
        cargarMisionesCercanas();
      }
    };

    if (!inicializado.current) {
      iniciarCarga();
      inicializado.current = true;
    }

    const interval = setInterval(() => {
      if (isMounted && !misionActiva) {
        cargarMisionesCercanas(true);
      }
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [cargarMisionesCercanas, misionActiva]);

  // --- Lógica de botones (aceptar/finalizar) igual que antes ---
  const aceptarMision = async (punto) => {
    setProcesando(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/logistica/aceptar-mision?puntoId=${punto.id}&encargadoId=${user.id}`,
        { method: "POST" },
      );
      if (res.ok) {
        setMisionActiva(punto);
        toast.success("GPS VINCULADO");
      }
    } catch (err) {
      toast.error("Error de conexión", { message: " ", err });
    } finally {
      setProcesando(false);
    }
  };

  const finalizarRecoleccion = async () => {
    setProcesando(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/logistica/completar-recoleccion?puntoId=${misionActiva.id}`,
        { method: "POST" },
      );
      if (res.ok) {
        toast.success("VACIADO EXITOSO");
        setMisionActiva(null);
        cargarMisionesCercanas();
      }
    } catch (err) {
      toast.error("Error al cerrar reporte.", { message: " ", err });
    } finally {
      setProcesando(false);
    }
  };

  if (loading && alertas.length === 0)
    return (
      <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
        <p className="font-black italic text-gray-400 uppercase tracking-widest text-[10px]">
          Sincronizando misiones GTI-3...
        </p>
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <Toaster richColors position="top-center" />
      {/* El resto del JSX se mantiene igual al diseño que ya teníamos */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-[#111827] p-4 rounded-3xl text-amber-400">
            <Zap
              size={28}
              fill="currentColor"
              className={misionActiva ? "animate-pulse" : ""}
            />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase text-gray-900 leading-none">
              Terminal GTI
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase italic mt-2">
              {misionActiva
                ? "Misión activa en Popayán"
                : `${alertas.length} alertas`}
            </p>
          </div>
        </div>
      </div>

      {misionActiva ? (
        <div className="bg-emerald-500 rounded-[50px] p-10 text-white shadow-2xl animate-in zoom-in duration-500">
          <h3 className="text-4xl font-black italic uppercase">
            {misionActiva.nombre}
          </h3>
          <p className="font-bold mb-8 italic opacity-90">
            {misionActiva.direccion}
          </p>
          <button
            disabled={procesando}
            onClick={finalizarRecoleccion}
            className="w-full md:w-auto bg-white text-emerald-600 px-10 py-5 rounded-[25px] font-black italic uppercase tracking-widest flex items-center justify-center gap-3"
          >
            {procesando ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle2 />
            )}{" "}
            Vaciado Completado
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alertas.map((punto) => (
            <div
              key={punto.id}
              className="bg-white border border-gray-100 p-8 rounded-[40px] hover:shadow-xl transition-all"
            >
              <h4 className="font-black italic text-xl uppercase mb-2">
                {punto.nombre}
              </h4>
              <p className="text-xs text-gray-400 font-bold mb-6">
                {punto.direccion}
              </p>
              <button
                disabled={procesando}
                onClick={() => aceptarMision(punto)}
                className="w-full flex items-center justify-center gap-3 bg-[#111827] text-white py-5 rounded-[24px] font-black italic uppercase text-[10px] tracking-[0.25em]"
              >
                {procesando ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Navigation size={18} fill="currentColor" />
                )}
                Reclamar Misión
              </button>
            </div>
          ))}
          {alertas.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-[45px] text-gray-300 font-black italic uppercase text-xs">
              Sin alertas críticas en el mapa
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VistaMisiones;
