import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

const SuccessModal = ({ isOpen, onClose, productoNombre }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
      <div className="relative bg-white p-10 rounded-[45px] shadow-2xl border border-gray-100 max-w-sm w-full text-center animate-in zoom-in duration-500">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-5 rounded-full animate-bounce">
            <CheckCircle2
              size={50}
              className="text-emerald-500"
              strokeWidth={3}
            />
          </div>
        </div>
        <h2 className="text-3xl font-black italic tracking-tighter text-gray-900 uppercase">
          ¡Canje Exitoso!
        </h2>
        <p className="text-gray-500 mt-4 font-medium italic">
          Tu pedido de{" "}
          <span className="text-emerald-600 font-bold">{productoNombre}</span>{" "}
          ha sido registrado. Te notificaremos cuando esté listo.
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;
