import {
  Leaf,
  LayoutDashboard,
  MapPin,
  ShoppingBag,
  History,
  Home,
  ChevronDown,
  Star,
  Lock,
} from "lucide-react";
import { useState } from "react";
import UserDropdown from "./Profile/UserDropdown";
import NotificationBell from "./Profile/NotificationBell";

const Navbar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 🔥 PROTOCOLO GTI-INITIALS: Extrae 1ra letra de nombre y 1ra de apellido
  const getInitials = (fullName) => {
    if (!fullName) return "??";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-6 py-3 md:py-4">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div
          onClick={() => setActiveTab("inicio")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-[#10b981] p-1.5 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-emerald-100">
            <Leaf className="text-white" size={20} fill="currentColor" />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight text-[#064e3b]">
            EcoRecicla
          </span>
        </div>

        {/* Desktop Navigation - Oculto en móviles */}
        <div className="hidden md:flex items-center gap-1 bg-gray-50/50 p-1 rounded-2xl">
          <NavItem
            icon={Home}
            label="Inicio"
            active={activeTab === "inicio"}
            onClick={() => setActiveTab("inicio")}
          />
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeTab === "dashboard"}
            isLocked={!user}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            icon={MapPin}
            label="Puntos de Recolección"
            active={activeTab === "puntos"}
            isLocked={!user}
            onClick={() => setActiveTab("puntos")}
          />
          <NavItem
            icon={History}
            label="Historial"
            active={activeTab === "historial"}
            isLocked={!user}
            onClick={() => setActiveTab("historial")}
          />{" "}
          {user?.rol !== "ENCARGADO" && (
            <NavItem
              icon={ShoppingBag}
              label="Catálogo"
              active={activeTab === "catalogo"}
              isLocked={!user}
              onClick={() => setActiveTab("catalogo")}
            />
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {user && (
            <>
              {/* 🔔 CAMPANITA - Oculta en móviles muy pequeños */}
              <div className="hidden sm:block">
                <NotificationBell user={user} />
              </div>

              {/* ⭐ Puntos - Versión compacta para móvil */}
              <div className="bg-[#ecfdf5] border border-[#10b981]/20 px-2 md:px-3 py-1 rounded-full flex items-center gap-1.5">
                <Star size={14} className="text-[#10b981] fill-current" />
                <span className="text-[#065f46] font-bold text-xs md:text-sm">
                  {user.rol === "RECICLADOR"
                    ? user.billetera?.saldoPuntos || 0
                    : 0}{" "}
                  pts
                </span>
              </div>
            </>
          )}

          <div className="relative">
            {user ? (
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 md:gap-2 pl-1.5 md:pl-2 border-l border-gray-100 ml-0.5 md:ml-1 cursor-pointer"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 bg-[#10b981] text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm">
                  {getInitials(user.nombre)}
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform hidden md:block ${isDropdownOpen ? "rotate-180" : ""}`}
                />
                <UserDropdown
                  isOpen={isDropdownOpen}
                  onClose={() => setIsDropdownOpen(false)}
                  setActiveTab={setActiveTab}
                  onLogout={onLogout}
                  user={user}
                  initials={getInitials(user.nombre)}
                />
              </div>
            ) : (
              <button
                onClick={() => setActiveTab("registro")}
                className="bg-emerald-500 text-white px-4 md:px-8 py-2 md:py-2.5 rounded-xl font-black italic uppercase text-[9px] md:text-[10px] tracking-widest shadow-lg shadow-emerald-100 hover:bg-[#059669] hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                Registrarse
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// 🛡️ Componente Interno Limpio para NavItem (Desktop)
const NavItem = ({ icon: Icon, label, active, onClick, isLocked }) => (
  <button
    onClick={!isLocked ? onClick : null}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative
    ${isLocked ? "opacity-40 grayscale cursor-not-allowed" : "cursor-pointer"}
    ${active ? "bg-white shadow-sm border border-gray-100 text-[#10b981] scale-105" : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"}`}
  >
    <div className="relative">
      <Icon size={18} />
      {isLocked && (
        <div className="absolute -top-1 -right-1 bg-amber-400 p-0.5 rounded-full border border-white animate-bounce">
          <Lock size={6} className="text-white fill-white" />
        </div>
      )}
    </div>
    {label}
  </button>
);

// 📱 Componente para Mobile NavItem (más compacto)
const MobileNavItem = ({ icon: Icon, label, active, onClick, isLocked }) => (
  <button
    onClick={!isLocked ? onClick : null}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative
    ${isLocked ? "opacity-40 grayscale cursor-not-allowed" : "cursor-pointer"}
    ${active ? "bg-emerald-50 text-[#10b981]" : "text-gray-600 hover:bg-gray-50"}`}
  >
    <div className="relative">
      <Icon size={18} />
      {isLocked && (
        <div className="absolute -top-1 -right-1 bg-amber-400 p-0.5 rounded-full border border-white">
          <Lock size={6} className="text-white fill-white" />
        </div>
      )}
    </div>
    {label}
  </button>
);

export default Navbar;
