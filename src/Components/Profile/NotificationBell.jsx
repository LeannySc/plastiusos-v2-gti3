import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, Zap, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../../api/config";
import { toast } from "sonner";

const NotificationBell = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Ref para evitar múltiples disparos en el primer render
  const haInicializado = useRef(false);

  const fetchAlertas = useCallback(async () => {
    // Seguridad GTI: Si no es encargado, el radar se apaga
    if (user?.rol !== "ENCARGADO") return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/logistica/botes-cercanos?lat=2.4419&lon=-76.6063`,
      );
      if (!res.ok) return;
      const data = await res.json();
      setAlertas(data);
    } catch (err) {
      console.error("🛰️ Fallo en radar de logística:", err);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    // 🚀 Lógica de inicio sin bloqueo (Async microtask)
    const handleInitialLoad = async () => {
      await Promise.resolve(); // Pequeño respiro para el event loop de React
      if (isMounted && !haInicializado.current) {
        fetchAlertas();
        haInicializado.current = true;
      }
    };

    handleInitialLoad();

    // Polling industrial (Cada 20 segundos busca botes llenos)
    const timer = setInterval(() => {
      if (isMounted) fetchAlertas();
    }, 20000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [fetchAlertas]);

  const aceptarMision = async (puntoId) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/logistica/aceptar-mision?puntoId=${puntoId}&encargadoId=${user.id}`,
        { method: "POST" },
      );
      if (res.ok) {
        toast.success("🚜 MISIÓN VINCULADA", {
          description: "Ruta asignada en tu terminal móvil.",
        });
        setIsOpen(false);
        fetchAlertas(); // Actualiza tras aceptar
      }
    } catch (err) {
      toast.error("Error al sincronizar misión", { message: "", err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-2xl border transition-all group ${
          alertas.length > 0
            ? "bg-amber-50 border-amber-200 text-amber-500 shadow-sm"
            : "bg-gray-50 border-gray-100 text-gray-400"
        }`}
      >
        <Bell
          size={20}
          className={`${alertas.length > 0 ? "animate-[bounce_2s_infinite]" : ""} group-hover:scale-110 transition-transform`}
        />
        {alertas.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
            {alertas.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-4 w-80 bg-white rounded-[35px] shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#111827] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-amber-400 fill-amber-400" />
                <h4 className="font-black italic uppercase text-[10px] tracking-widest">
                  Alertas Locales
                </h4>
              </div>
              <span className="bg-white/10 px-2 py-0.5 rounded text-[8px] font-bold text-gray-400 italic">
                5KM RADIO
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {alertas.length > 0 ? (
                alertas.map((punto) => (
                  <div
                    key={punto.id}
                    className="p-4 hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="bg-red-50 text-red-500 p-3 rounded-2xl h-fit">
                        <MapPin size={18} />
                      </div>
                      <div className="flex-grow">
                        <h5 className="font-black italic text-gray-900 uppercase text-[11px] leading-tight mb-1">
                          {punto.nombre}
                        </h5>
                        <p className="text-[10px] text-gray-400 font-bold mb-3 italic">
                          {punto.direccion}
                        </p>
                        <div className="flex items-center justify-between border-t border-dashed border-gray-100 pt-3">
                          <span className="text-[11px] font-black text-red-500 uppercase italic">
                            {punto.nivelLlenado}%
                          </span>
                          <button
                            disabled={loading}
                            onClick={() => aceptarMision(punto.id)}
                            className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-black italic uppercase text-[9px] tracking-wider hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-100 disabled:opacity-50"
                          >
                            {loading ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              "Aceptar"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-14 text-center">
                  <CheckCircle2
                    size={35}
                    className="mx-auto text-emerald-100 mb-3"
                  />
                  <p className="text-[11px] font-black uppercase text-gray-300 italic tracking-widest">
                    Todo en orden
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
