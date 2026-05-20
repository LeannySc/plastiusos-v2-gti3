// src/Components/Notifications/RecicladorFeed.jsx
import { useEffect, useState, useMemo } from "react";
import {
  X,
  Recycle,
  ShoppingBag,
  ShieldCheck,
  Bell,
  Info,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import { API_BASE_URL, GTI_HEADERS } from "../../api/config";

const RecicladorFeed = ({ user, close }) => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. MAPEADOR GTI: Íconos y Colores por origen
  const configOrigen = {
    "TransaccionService.java": {
      icon: Recycle,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      label: "Pesaje IoT",
    },
    "CanjeService.java": {
      icon: ShoppingBag,
      // Lógica dinámica: Si el título dice "AGOTADO", usar rojo.
      color: (notif) =>
        notif.titulo.includes("AGOTADO") ? "text-red-600" : "text-purple-500",
      label: "INVENTARIO",
    },
    "UsuarioService.java": {
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-50",
      label: "Seguridad Red",
    },
    DEFAULT: {
      icon: Bell,
      color: "text-gray-400",
      bg: "bg-gray-50",
      label: "Notificación",
    },
    "SessionReciclajeService.java": {
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-50",
      label: "INFRAESTRUCTURA",
    },
    "LogisticaService.java": {
      icon: MapPin,
      color: "text-orange-500",
      bg: "bg-orange-50",
      label: "LOGÍSTICA",
    },
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/identidad/${user.id}/notificaciones`, {
      headers: GTI_HEADERS,
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user.id]);

  // Cálculo de actividad de hoy (Solo las de fecha actual)
  const actividadHoy = useMemo(() => {
    const hoy = new Date().toISOString().split("T")[0];
    return notifs.filter((n) => n.fecha?.startsWith(hoy)).length;
  }, [notifs]);

  return (
    <div className="animate-in slide-in-from-right duration-500">
      <div className="p-8 flex justify-between items-center border-b border-gray-100 bg-white">
        <div>
          <h4 className="text-xl font-black uppercase italic tracking-tighter text-gray-900">
            {user.rol === "ADMINISTRADOR" ? "AUDITORÍA GLOBAL" : "FEED GTI-3"}
          </h4>
          <p className="text-[9px] font-bold text-gray-400 uppercase italic">
            Centro de Control de Popayán
          </p>
        </div>
        <button
          onClick={close}
          className="p-3 hover:bg-gray-100 rounded-full text-gray-400 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-8 space-y-6">
        {/* DASHBOARD MINI FIGMA */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50/40 p-5 rounded-[30px] border border-emerald-100/50 text-center shadow-inner">
            <span className="text-3xl font-black italic text-emerald-600 block leading-none">
              {actividadHoy}
            </span>
            <p className="text-[8px] font-black text-emerald-400 uppercase mt-2">
              Actividad Hoy
            </p>
          </div>
          <div className="bg-purple-50/40 p-5 rounded-[30px] border border-purple-100/50 text-center shadow-inner">
            <span className="text-xl font-black italic text-purple-600 truncate inline-block w-full leading-none">
              {user.rol}
            </span>
            <p className="text-[8px] font-black text-purple-400 uppercase mt-2 italic">
              Status Nivel
            </p>
          </div>
        </div>

        {/* FEED DE ALERTAS */}
        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
          {notifs.length === 0 && !loading && (
            <div className="py-20 text-center opacity-30">
              <Info className="mx-auto mb-2" size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Sin actividad pendiente
              </p>
            </div>
          )}

          {notifs.map((n) => {
            const nConfig = configOrigen[n.claseOrigen] || configOrigen.DEFAULT;
            const Icono = nConfig.icon;

            const colorFinal =
              typeof nConfig.color === "function"
                ? nConfig.color(n)
                : nConfig.color;

            return (
              <div
                key={n.id}
                className="group p-6 bg-white border border-gray-100 rounded-[35px] shadow-sm hover:shadow-xl hover:border-emerald-500/10 transition-all flex gap-5"
              >
                <div
                  className={`${nConfig.bg} ${colorFinal} p-4 rounded-[22px] ...`}
                >
                  <Icono size={22} />
                </div>

                <div className="flex-grow space-y-1">
                  <div className="flex justify-between items-start">
                    <h5 className="font-black text-[13px] text-gray-800 uppercase italic leading-tight">
                      {n.titulo}
                    </h5>
                    <span className="text-[9px] text-gray-300 font-bold">
                      {n.fecha?.split("T")[0].split("-").reverse().join("/")}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">
                    {n.mensaje}
                  </p>

                  {n.subtexto && (
                    <div className="bg-gray-50/50 px-3 py-1.5 rounded-xl border border-gray-100/50 text-[10px] font-bold text-gray-400 inline-block">
                      {n.subtexto}
                    </div>
                  )}

                  <div className="flex gap-2 pt-3">
                    <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[8px] font-black uppercase rounded-lg border border-gray-100 italic tracking-widest">
                      {nConfig.label}
                    </span>
                    <span className="px-3 py-1 bg-gray-900 text-gray-100 text-[8px] font-bold rounded-lg lowercase opacity-20">
                      {n.claseOrigen}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default RecicladorFeed;
