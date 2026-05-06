import { User, Settings, LogOut, ChevronRight, Scale } from "lucide-react";

const UserDropdown = ({
  isOpen,
  onClose,
  setActiveTab,
  onLogout,
  user,
  initials,
}) => {
  if (!isOpen || !user) return null;

  return (
    <>
      {/* Capa invisible para cerrar al hacer clic fuera */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      <div className="absolute top-16 right-0 w-72 bg-white rounded-[30px] shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* 🟢 Encabezado Sincronizado con Base de Datos */}
        <div className="p-6 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-white italic shadow-sm">
            {initials}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-black text-gray-900 leading-tight truncate uppercase italic text-sm">
              {user.nombre}
            </h4>
            <p className="text-[10px] text-gray-400 font-bold truncate">
              {user.correo}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100">
              {user.rol}
            </span>
          </div>
        </div>

        {/* Opciones */}
        <div className="p-2">
          <MenuOption
            icon={User}
            label="Mi Perfil"
            onClick={() => {
              setActiveTab("perfil");
              onClose();
            }}
          />
          {/* 🚀 Opción 2: TERMINAL DE PESAJE (Para Encargado y Admin) */}
          {(user.rol === "ENCARGADO" || user.rol === "ADMINISTRADOR") && (
            <MenuOption
              icon={Scale}
              label="Terminal de Pesaje"
              onClick={() => {
                setActiveTab("manual");
                onClose();
              }}
            />
          )}
          {/* Solo mostramos Panel Admin si el rol es correcto */}
          {user.rol === "ADMINISTRADOR" && (
            <MenuOption
              icon={Settings}
              label="Panel Admin Master"
              onClick={() => {
                setActiveTab("admin");
                onClose();
              }}
            />
          )}
        </div>

        {/* Logout */}
        <div className="p-2 bg-gray-50/50">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
          >
            <LogOut
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-xs font-black uppercase italic tracking-widest">
              Cerrar Protocolo
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

const MenuOption = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-2xl transition-all group"
  >
    <div className="flex items-center gap-3 text-gray-500 group-hover:text-gray-900">
      <Icon size={18} />
      <span className="text-xs font-bold uppercase italic tracking-tight">
        {label}
      </span>
    </div>
    <ChevronRight
      size={14}
      className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all"
    />
  </button>
);

export default UserDropdown;
