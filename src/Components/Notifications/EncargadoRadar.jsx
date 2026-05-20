import { useEffect, useState, useCallback, useRef } from "react";
import { Zap, MapPin, Loader2, X, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "../../api/config";
import { toast } from "sonner";

const EncargadoRadar = ({ user, close }) => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true); // 🛡️ Protege contra fugas de memoria

  // 📡 1. Lógica de radar (Mantenemos useCallback para estabilidad)
  const fetchRadar = useCallback(async () => {
    try {
      // 🛰️ Revisar primero si el encargado ya está ocupado
      const checkRes = await fetch(
        `${API_BASE_URL}/logistica/mision-actual?encargadoId=${user.id}`,
      );

      if (!isMounted.current) return;

      if (checkRes.status === 200) {
        // 🚧 Tiene misión activa:
        // limpiamos radar para evitar nuevas asignaciones
        setAlertas([]);
        return;
      }

      // 📡 Flujo normal
      const res = await fetch(
        `${API_BASE_URL}/logistica/botes-cercanos?lat=2.4419&lon=-76.6063`,
      );

      if (res.ok && isMounted.current) {
        const data = await res.json();
        setAlertas(data);
      }
    } catch (err) {
      console.error("Fallo en telemetría GTI:", err);
    }
  }, [user.id]);

  // 🔄 2. Efecto de Sincronización REPARADO
  useEffect(() => {
    isMounted.current = true;

    // 🚀 TRUCO DE ARQUITECTO: Envolvemos la carga inicial en una promesa resuelta
    // Esto saca la llamada del hilo principal de React y elimina el error de Cascading Renders.
    const startRadar = async () => {
      await Promise.resolve();
      if (isMounted.current) {
        fetchRadar();
      }
    };

    startRadar();

    const interval = setInterval(() => {
      if (isMounted.current) fetchRadar();
    }, 15000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [fetchRadar]);

  const aceptar = async (puntoId) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/logistica/aceptar-mision?puntoId=${puntoId}&encargadoId=${user.id}`,
        { method: "POST" },
      );
      if (res.ok) {
        toast.success("🚜 Misión vinculada al satélite.");
        close();
      }
    } catch (err) {
      toast.error("Error de comunicación.", err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="p-6 bg-[#111827] text-white flex justify-between items-center rounded-t-[45px]">
        <div className="flex items-center gap-3">
          <Zap className="text-amber-400 fill-current" size={20} />
          <h4 className="text-sm font-black uppercase italic tracking-tighter">
            Centro de Misiones
          </h4>
        </div>
        <button onClick={close} className="p-2 hover:bg-white/10 rounded-full">
          <X size={18} />
        </button>
      </div>

      <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar bg-gray-50/20">
        {alertas.length > 0 ? (
          alertas.map((p) => (
            <div
              key={p.id}
              className="p-5 bg-white border border-gray-100 rounded-[35px] flex gap-4 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="bg-red-50 text-red-500 p-3 rounded-2xl h-fit">
                <MapPin size={20} />
              </div>
              <div className="flex-grow">
                <h5 className="font-black text-gray-800 text-xs uppercase leading-tight">
                  {p.nombre}
                </h5>
                <p className="text-[10px] text-gray-400 font-bold mt-1">
                  {p.direccion}
                </p>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-dashed border-gray-100">
                  <span className="text-[11px] font-black text-red-500 italic">
                    {p.nivelLlenado}% CRÍTICO
                  </span>
                  <button
                    disabled={loading}
                    onClick={() => aceptar(p.id)}
                    className="bg-emerald-500 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase shadow-lg active:scale-95 transition-all flex items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      "Vincular"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center opacity-30">
            <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">
              Sin alertas críticas
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncargadoRadar;
