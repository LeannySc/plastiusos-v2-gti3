import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { ShieldAlert } from "lucide-react";
/* Importación de Vistas (Crearemos estos archivos a continuación) */
import AdminDashboardView from "./AdminViews/AdminDashboardView";
import AdminTransactionsView from "./AdminViews/AdminTransactionsView";
import AdminPointsView from "./AdminViews/AdminPointsView";
import AdminCatalogView from "./AdminViews/AdminCatalogView";
import AdminUsersView from "./AdminViews/AdminUsersView";
import AdminInactivePointsView from "./AdminViews/AdminInactivePointsView";

const AdminPanel = () => {
  const [adminTab, setAdminTab] = useState("dashboard");

  const renderView = () => {
    switch (adminTab) {
      case "dashboard":
        return <AdminDashboardView />;
      case "transactions":
        return <AdminTransactionsView />;
      case "points":
        return <AdminPointsView />;
      case "catalog":
        return <AdminCatalogView />;
      case "users":
        return <AdminUsersView />;
      default:
        return <AdminDashboardView />;
      // En el renderView switch:
      case "bodega":
        return <AdminInactivePointsView />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
      {/* SIDEBAR FIJO PARA ADMIN */}
      <div className="w-full lg:w-72 shrink-0">
        <AdminSidebar activeTab={adminTab} setTab={setAdminTab} />
      </div>

      {/* CONTENIDO DINÁMICO DE ADMINISTRACIÓN */}
      <div className="flex-grow space-y-8">
        {/* HEADER DEL PANEL */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#a855f7] p-3 rounded-2xl shadow-lg shadow-purple-200 text-white">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-gray-900 uppercase">
                Panel de Administración
              </h1>
              <p className="text-gray-400 text-sm font-medium italic">
                Gestión completa del sistema EcoRecicla
              </p>
            </div>
          </div>

          {/* BOTÓN DE ALERTAS PENDIENTES */}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 border border-orange-100 rounded-full text-orange-600 font-bold text-xs hover:bg-orange-100 transition-all active:scale-95">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
            1 pendientes de revisión
          </button>
        </div>

        {/* VISTA RENDERIZADA */}
        <div className="min-h-[600px]">{renderView()}</div>
      </div>
    </div>
  );
};

export default AdminPanel;
