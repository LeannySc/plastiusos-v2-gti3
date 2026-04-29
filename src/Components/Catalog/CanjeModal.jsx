import { X, Star, Package } from "lucide-react";

const CanjeModal = ({ product, isOpen, onClose, onConfirm, userPoints }) => {
  // Verificación de seguridad GTI-3
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-in fade-in duration-200">
      {/* Overlay con desenfoque industrial */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-[45px] shadow-2xl max-w-xl w-full overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Imagen del producto - CORREGIDO ✅ */}
        <div className="relative h-64 w-full bg-gray-100">
          <img
            src={
              product?.imagenUrl ||
              "https://images.unsplash.com/photo-1610473068541-1f91b7d5612c?q=80&w=500&auto=format&fit=crop"
            }
            alt={product?.nombre}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-4 left-6 px-4 py-1.5 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-gray-600 shadow-sm border border-white">
            {product?.categoria || "General"}
          </span>
        </div>

        <div className="p-10 space-y-6">
          <div>
            <h2 className="text-3xl font-black italic text-gray-900 uppercase tracking-tighter leading-none">
              {product?.nombre}
            </h2>
            <p className="text-gray-400 mt-2 font-medium italic text-sm leading-relaxed">
              {product?.descripcion || "Sin descripción disponible."}
            </p>
          </div>

          <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Costo del canje
              </span>
              <div className="flex items-center gap-2 text-emerald-500 font-black italic">
                <Star size={14} fill="currentColor" />
                <span className="text-xl leading-none">
                  {product?.costoPuntos || 0}{" "}
                  <span className="text-xs uppercase ml-1 opacity-60 font-medium">
                    puntos
                  </span>
                </span>
              </div>
            </div>
            <div className="text-right space-y-1 border-l border-gray-200 pl-6">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Tu saldo
              </span>
              <p className="text-gray-900 font-black italic text-xl leading-none">
                {userPoints}{" "}
                <span className="text-xs uppercase ml-1 font-medium text-gray-400">
                  pts
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-400 font-bold italic text-xs">
            <Package size={14} />{" "}
            <span>{product?.stock || 0} unidades disponibles</span>
          </div>

          <button
            onClick={() => onConfirm(product)}
            disabled={userPoints < (product?.costoPuntos || 0)}
            className={`w-full py-5 rounded-[25px] font-black italic uppercase text-xs tracking-[0.2em] transition-all shadow-xl
              ${
                userPoints >= (product?.costoPuntos || 0)
                  ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200 hover:shadow-emerald-300 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              }`}
          >
            {userPoints >= (product?.costoPuntos || 0)
              ? `Confirmar Canje — ${product?.costoPuntos || 0} puntos`
              : "Saldo Insuficiente"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanjeModal;
