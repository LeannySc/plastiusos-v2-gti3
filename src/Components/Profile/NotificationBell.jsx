// src/Components/Notifications/NotificationBell.jsx

import { useState } from "react";
import { Bell } from "lucide-react";
import RecicladorFeed from "../Notifications/RecicladorFeed";
import EncargadoRadar from "../Notifications/EncargadoRadar";

const NotificationBell = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-emerald-500 transition-all shadow-sm active:scale-90"
      >
        <Bell size={20} />

        {/* Pequeño indicador rojo de "New" */}
        <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute right-0 mt-6 w-[480px] bg-white rounded-[55px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 z-50 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* LÓGICA DE TABLERO GTI-3 */}
            {/* ENCARGADO -> Radar */}
            {/* RECICLADOR + ADMIN -> Feed */}

            {user.rol === "ENCARGADO" ? (
              <EncargadoRadar user={user} close={() => setIsOpen(false)} />
            ) : (
              <RecicladorFeed user={user} close={() => setIsOpen(false)} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
