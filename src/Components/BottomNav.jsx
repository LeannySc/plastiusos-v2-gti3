// src/Components/BottomNav.jsx
import { Home, LayoutDashboard, MapPin, ShoppingBag, History, User, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const BottomNav = ({ activeTab, setActiveTab, user }) => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNav, setShowNav] = useState(true);

  // Definir las pestañas disponibles según el rol del usuario
  const tabs = [
    { id: "inicio", icon: Home, label: "Inicio" },
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", locked: !user },
    { id: "puntos", icon: MapPin, label: "Puntos", locked: !user },
    ...(user?.rol !== "ENCARGADO" 
      ? [{ id: "catalogo", icon: ShoppingBag, label: "Catálogo", locked: !user }] 
      : []),
    { id: "historial", icon: History, label: "Historial", locked: !user },
    { id: "perfil", icon: User, label: "Perfil", locked: !user },
  ].filter(tab => !tab.locked);

  // Manejo de gestos para ocultar/mostrar navbar al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false);
      } else if (currentScrollY < lastScrollY) {
        setShowNav(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  return (
    <>
      {!showNav && (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/10 to-transparent z-40 md:hidden pointer-events-none" />
      )}
      
      <nav 
        className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 pb-safe z-50 md:hidden transition-all duration-300 ease-out ${
          showNav ? 'translate-y-0 shadow-2xl shadow-black/10' : 'translate-y-full'
        }`}
      >
        <div className="safe-area-inset-bottom">
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full opacity-50" />
          </div>
          
          <div className="flex justify-around items-center px-2 pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex flex-col items-center justify-center w-full py-2 touch-manipulation active:scale-95 transition-all duration-200"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent rounded-2xl scale-90" />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div 
                      className={`relative transition-all duration-300 ${
                        isActive ? 'scale-110 -translate-y-1' : 'scale-100'
                      }`}
                    >
                      <Icon 
                        size={24} 
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`transition-all duration-300 ${
                          isActive 
                            ? 'text-[#10b981] drop-shadow-lg' 
                            : 'text-gray-400'
                        }`}
                      />
                      
                      {tab.id === 'catalogo' && user?.rol !== 'ENCARGADO' && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                      )}
                      
                      {isActive && (
                        <Sparkles 
                          size={12} 
                          className="absolute -top-2 -right-2 text-emerald-400 animate-pulse" 
                        />
                      )}
                    </div>
                    
                    <span 
                      className={`text-[10px] font-bold mt-1 transition-all duration-300 ${
                        isActive 
                          ? 'text-[#10b981] scale-105 translate-y-0 opacity-100' 
                          : 'text-gray-400 scale-95 translate-y-1 opacity-70'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                  
                  {isActive && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#10b981] rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
