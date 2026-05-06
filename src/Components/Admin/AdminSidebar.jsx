import {
  LayoutDashboard,
  ReceiptText,
  MapPin,
  ShoppingBag,
  Users,
  Zap,
  EyeOff,
} from "lucide-react";

const AdminSidebar = ({ activeTab, setTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transacciones", icon: ReceiptText },
    { id: "points", label: "Puntos de Recolección", icon: MapPin },
    { id: "catalog", label: "Catálogo", icon: ShoppingBag },
    { id: "users", label: "Usuarios", icon: Users },
    { id: "misiones", label: "Misiones Rápidas", icon: Zap },
    { id: "bodega", label: "Bodega Técnica", icon: EyeOff },
  ];

  return (
    <div className="bg-white p-4 rounded-[40px] border border-gray-100 shadow-sm sticky top-28">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-sm font-black italic uppercase transition-all
            ${
              activeTab === item.id
                ? "bg-[#a855f7] text-white shadow-xl shadow-purple-200"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            }`}
          >
            <item.icon size={20} strokeWidth={2.5} />
            <span className="tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
