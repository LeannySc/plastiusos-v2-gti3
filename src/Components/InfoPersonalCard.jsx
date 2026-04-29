import {
  Edit2,
  ShieldCheck,
  Mail,
  User as UserIcon,
  Calendar,
} from "lucide-react";

export const InfoPersonalCard = () => (
  <div className="lg:col-span-2 space-y-6">
    <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm relative">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-gray-900">
          Información Personal
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold hover:bg-emerald-100 transition-all">
          <Edit2 size={14} /> Editar
        </button>
      </div>

      <div className="space-y-4">
        <ReadOnlyInput
          label="Nombre completo"
          value="María García"
          icon={UserIcon}
        />
        <ReadOnlyInput
          label="Correo electrónico"
          value="maria.garcia@email.com"
          icon={Mail}
        />
        <ReadOnlyInput
          label="Rol en el sistema"
          value="Reciclador"
          icon={ShieldCheck}
        />
        <ReadOnlyInput
          label="Fecha de registro"
          value="2024-01-15"
          icon={Calendar}
        />
      </div>
    </div>
  </div>
);

const ReadOnlyInput = ({ label, value, icon: Icon }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
      <Icon size={12} /> {label}
    </label>
    <div className="w-full bg-gray-50/50 border border-gray-50 px-5 py-3 rounded-2xl text-sm font-bold text-gray-700">
      {value}
    </div>
  </div>
);
