import { useState, useEffect } from "react";
import { Search, Trash2, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../../../api/config";

const AdminUsersView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 🛰️ CONSUMO DEL BACKEND: Lista de usuarios de la base de datos
  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/gestionar-usuarios`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al sincronizar usuarios:", err);
        setLoading(false);
      });
  }, []);

  // 🔍 MOTOR DE BÚSQUEDA INDUSTRIAL
  const filteredUsers = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.correo.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 🎨 PROTOCOLO DE INICIALES GTI
  const getInitials = (name) => {
    if (!name) return "??";
    const p = name.trim().split(" ");
    return p.length > 1
      ? (p[0][0] + p[p.length - 1][0]).toUpperCase()
      : p[0][0].toUpperCase();
  };

  if (loading)
    return (
      <div className="bg-white p-20 rounded-[45px] flex flex-col items-center justify-center border border-gray-100">
        <Loader2 className="animate-spin text-purple-500 mb-4" size={40} />
        <p className="font-black italic text-gray-400 uppercase tracking-widest text-xs">
          Accediendo a Base de Datos...
        </p>
      </div>
    );

  return (
    <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* HEADER DE GESTIÓN */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">
            Gestión de Usuarios
          </h3>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1 italic">
            Total en red: {users.length} integrantes
          </p>
        </div>

        {/* BARRA DE BÚSQUEDA */}
        <div className="relative w-full md:w-96 group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-3xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:italic"
          />
        </div>
      </div>

      {/* LISTADO DE RESULTADOS */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            initials={getInitials(user.nombre)}
          />
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-20 text-gray-300 font-black italic uppercase tracking-[0.2em]">
            No se encontraron coincidencias
          </div>
        )}
      </div>
    </div>
  );
};

/* 🚀 COMPONENTE UserRow: MAQUETADO DE ALTA GAMA */
const UserRow = ({ user, initials }) => {
  // Lógica de badges de roles según tus clases Java
  const roleStyles = {
    RECICLADOR: "bg-emerald-50 text-emerald-600 border-emerald-100",
    ENCARGADO: "bg-indigo-50 text-indigo-600 border-indigo-100",
    ADMINISTRADOR: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-5 bg-white border border-gray-50 rounded-[35px] hover:shadow-xl hover:shadow-gray-200/20 hover:border-purple-100 transition-all duration-300 group">
      <div className="flex items-center gap-5 w-full md:w-auto">
        {/* Avatar dinámico */}
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center font-black italic text-xl shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform">
          {initials}
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-lg leading-none uppercase tracking-tighter italic">
            {user.nombre}
          </h4>
          <p className="text-[11px] text-gray-400 font-medium mt-1.5">
            {user.correo}
          </p>
        </div>
      </div>

      {/* Bloque de Información Real del Backend */}
      <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-end">
        {/* Rol del Sistema */}
        <div
          className={`px-4 py-2 rounded-2xl border text-[9px] font-black uppercase italic tracking-widest ${roleStyles[user.rol] || "bg-gray-50 text-gray-500"}`}
        >
          {user.rol}
        </div>

        {/* Saldo Atómico (Si es Reciclador) */}
        {user.rol === "RECICLADOR" && (
          <div className="flex flex-col items-end">
            <span className="text-emerald-500 font-black italic text-lg tracking-tighter">
              {user.saldoPuntos || 0}{" "}
              <span className="text-[9px] uppercase font-bold text-gray-300 ml-0.5">
                pts
              </span>
            </span>
            <span className="text-[8px] font-bold text-gray-400 uppercase italic">
              Billetera
            </span>
          </div>
        )}

        {/* Status Verificado (boolean verificado de Java) */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase italic
             ${user.verificado ? "text-emerald-500 bg-emerald-50 border-emerald-100" : "text-amber-500 bg-amber-50 border-amber-100"}`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${user.verificado ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`}
          ></div>
          {user.verificado ? "Activo" : "Pendiente"}
        </div>

        {/* Acciones de Auditoría */}
        <button className="p-3 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default AdminUsersView;
