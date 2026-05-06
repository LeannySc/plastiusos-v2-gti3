import { useEffect } from "react";
import { CheckCircle2, PackageCheck } from "lucide-react";

const SuccessModal = ({ isOpen, onClose, productoNombre }) => {
  // Auto-cierre para no obligar al usuario a dar clic
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // 4 segundos de gloria visual
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"></div>

      <div className="relative bg-white p-12 rounded-[50px] shadow-2xl border border-gray-100 max-w-sm w-full text-center animate-in zoom-in duration-500">
        <div className="flex justify-center mb-8">
          <div className="bg-emerald-50 p-6 rounded-full animate-bounce shadow-inner">
            <CheckCircle2
              size={60}
              className="text-emerald-500"
              strokeWidth={2.5}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-black italic tracking-tighter text-gray-900 uppercase">
            ¡Misión Exitosa!
          </h2>
          <p className="text-gray-400 font-medium italic text-sm px-4">
            Has canjeado con éxito tu <br />
            <span className="text-emerald-600 font-black uppercase not-italic">
              {productoNombre}
            </span>
            .
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          <PackageCheck size={14} />
          Procesando en bodega local
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
