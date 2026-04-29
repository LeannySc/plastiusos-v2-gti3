import { Check, X, Clock } from "lucide-react";

const AdminTransactionsView = () => (
  <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm space-y-6">
    <div className="flex justify-between items-center border-b border-gray-50 pb-6">
      <h3 className="text-xl font-bold text-gray-900 italic uppercase">
        Gestión de Transacciones
      </h3>
      <span className="bg-orange-50 text-orange-600 px-4 py-1 rounded-full text-[10px] font-black italic uppercase">
        1 pendiente(s) de revisión
      </span>
    </div>

    <div className="space-y-4">
      {/* ITEM TRANSACCIÓN PENDIENTE */}
      <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-[35px] flex items-center justify-between transition-hover hover:border-purple-200">
        <div className="space-y-1">
          <p className="font-bold text-gray-800">Entrega #3 — 2025-03-05</p>
          <p className="text-xs text-gray-400 font-medium">
            3 materiales · 190 puntos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-bold italic mr-4">
            <Clock size={12} /> Pendiente
          </span>
          <button className="flex items-center gap-2 bg-[#10b981] text-white px-6 py-2.5 rounded-2xl font-black italic text-[11px] uppercase hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100">
            <Check size={14} /> Aprobar
          </button>
          <button className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2.5 rounded-2xl font-black italic text-[11px] uppercase hover:bg-red-500 hover:text-white transition-all">
            <X size={14} /> Rechazar
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AdminTransactionsView;
