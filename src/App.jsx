// src/App.jsx
import { useState } from "react";
import Navbar from "./Components/Navbar";
import ModuloInicio from "./Components/ModuloInicio";
import PuntosRecoleccion from "./Components/PuntosRecoleccion";
import CatalogoPremios from "./Components/CatalogoPremios";
import HistorialActividad from "./Components/HistorialActividad";
import DashboardMaestro from "./Components/DashboardMaestro";
import PaginaPerfil from "./Components/PaginaPerfil";
import Registro from "./Components/Auth/Registro";
import Login from "./Components/Auth/Login";
import AdminPanel from "./Components/Admin/AdminPanel";

function App() {
  // 🟢 AHORA: Intentamos cargar usuario real guardado en memoria del navegador
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("gti_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activeTab, setActiveTab] = useState("inicio");

  // Al guardar el usuario, lo persistimos físicamente
  const handleLoginSuccess = (usuarioReal) => {
    setUser(usuarioReal);
    localStorage.setItem("gti_user", JSON.stringify(usuarioReal));
    setActiveTab("inicio");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("gti_user");
    setActiveTab("inicio");
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans pb-20">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <main className="max-w-[1400px] mx-auto p-6 md:p-10">
        {/* MODULOS PÚBLICOS */}
        {activeTab === "inicio" && <ModuloInicio />}
        {activeTab === "registro" && (
          <Registro
            onBack={() => setActiveTab("login")}
            onRegSuccess={() => setActiveTab("login")}
          />
        )}
        {activeTab === "login" && (
          <Login
            onRegister={() => setActiveTab("registro")}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* MODULOS PROTEGIDOS POR BASE DE DATOS */}
        {user ? (
          <>
            {activeTab === "puntos" && <PuntosRecoleccion />}
            {activeTab === "catalogo" && <CatalogoPremios />}
            {activeTab === "historial" && <HistorialActividad user={user} />}
            {activeTab === "dashboard" && (
              <DashboardMaestro user={user} setActiveTab={setActiveTab} />
            )}
            {activeTab === "perfil" && <PaginaPerfil user={user} />}
            {activeTab === "admin" && <AdminPanel />}
          </>
        ) : (
          activeTab !== "inicio" &&
          activeTab !== "registro" &&
          activeTab !== "login" &&
          setActiveTab("inicio")
        )}
      </main>
    </div>
  );
}

export default App;
