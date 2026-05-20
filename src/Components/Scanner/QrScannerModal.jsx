import { Scanner } from "@yudiel/react-qr-scanner";
import { X, ShieldCheck, Zap, Info } from "lucide-react";
import { API_BASE_URL } from "../../api/config";
import { toast } from "sonner";

const QrScannerModal = ({ isOpen, onClose, user, onPointsUpdate }) => {
  if (!isOpen) return null;

  const handleScan = async (result) => {
    if (!result || result.length === 0) return;

    const raw = result[0].rawValue;

    // acepta GTI_NODE_ID:5 o solo 5
    const puntoId = raw.includes(":") ? raw.split(":")[1] : raw;

    onClose();

    toast.promise(
      fetch(
        `${API_BASE_URL}/iot/escaneo-qr?userId=${user.id}&puntoId=${puntoId}`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        },
      ).then(async (res) => {
        const texto = await res.text();

        if (!res.ok) {
          throw new Error(texto || "Error de conexión");
        }

        return texto;
      }),

      {
        loading: "Sincronizando con el Satélite GTI-3...",

        success: (mensaje) => {
          // Si más adelante backend manda puntos:
          if (onPointsUpdate && user?.billetera?.saldoPuntos) {
            onPointsUpdate(user.billetera.saldoPuntos);
          }

          return mensaje || "🚀 Identidad Vinculada. Procede al pesaje.";
        },

        error: (err) => {
          if (err.message.includes("ocupado")) {
            return "⚠️ Nodo ocupado por otro ciudadano.";
          }

          return `❌ ${err.message}`;
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-in fade-in duration-500">
      {/* Fondo ultra-dark con blur */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-lg bg-white rounded-[55px] overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.3)] border border-emerald-500/20">
        {/* HEADER TÉCNICO */}
        <div className="p-8 bg-[#111827] text-white flex justify-between items-center relative overflow-hidden">
          <div className="flex items-center gap-3 z-10">
            <div className="bg-emerald-500 p-2 rounded-xl animate-pulse">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-black italic uppercase text-sm tracking-widest leading-none">
                GTI-Lens Pro
              </h3>
              <p className="text-[8px] font-bold text-emerald-400/60 uppercase mt-1">
                Popayán Biometric Scanning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="z-10 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-gray-400"
          >
            <X size={20} />
          </button>
          <Zap
            className="absolute -right-10 -bottom-10 text-white/5"
            size={150}
          />
        </div>

        {/* CONTENEDOR DE CÁMARA INDUSTRIAL */}
        <div className="relative aspect-square bg-black overflow-hidden group">
          <div className="absolute inset-0 z-10 pointer-events-none transition-opacity group-hover:opacity-50">
            {/* 🎥 MÁSCARA DE ENFOQUE (Oscurece los bordes) */}
            <div className="absolute inset-0 bg-black/40 scanner-mask"></div>

            {/* 🎯 CUADRO DE ENFOQUE GTI-3 */}
            <div className="absolute inset-0 flex items-center justify-center p-16">
              <div className="w-full h-full relative">
                {/* ESQUINAS DISEÑADAS */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl"></div>

                {/* LÁSER DINÁMICO */}
                <div className="absolute left-2 right-2 h-[2px] bg-emerald-400 shadow-[0_0_15px_#10b981] animate-[laser-scan_2.5s_infinite] z-20"></div>
              </div>
            </div>
          </div>

          <Scanner
            onScan={handleScan}
            allowMultiple={false}
            paused={!isOpen}
            components={{
              // Desactivamos los bordes por defecto de la librería para usar nuestros GTI personalizados
              audio: false,
              onOff: false,
            }}
            styles={{
              container: { width: "100%", height: "100%", padding: 0 },
            }}
            constraints={{
              aspectRatio: 1,
              facingMode: "environment",
            }}
          />
        </div>

        {/* PIE DE PAGINA CON INSTRUCCIÓN */}
        <div className="p-8 text-center bg-white space-y-4">
          <div className="flex items-center justify-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full inline-flex mx-auto">
            <Info size={12} className="animate-bounce" />
            <p className="text-[10px] font-black uppercase italic tracking-tighter">
              Sincronización Óptica Requerida
            </p>
          </div>
          <p className="text-gray-400 text-xs font-medium italic max-w-[240px] mx-auto leading-tight">
            Centra el código{" "}
            <span className="text-gray-900 font-black not-italic underline decoration-emerald-500">
              QR del nodo
            </span>{" "}
            dentro de los marcos verdes para abrir la exclusa.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QrScannerModal;
