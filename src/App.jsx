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
import PanelEncargado from "./Components/Admin/AdminViews/PanelEncargado";

function App() {
  // 🟢 Carga del usuario persistente
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("gti_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activeTab, setActiveTab] = useState("inicio");
  // 🛰️ Estado global de navegación
  const [navTarget, setNavTarget] = useState(null);

  // Manejo de eventos
  const handleLoginSuccess = (usuarioReal) => {
    setUser(usuarioReal);
    localStorage.setItem("gti_user", JSON.stringify(usuarioReal));
    setActiveTab("inicio");
  };
  const updateBalanceSilently = (usuarioActualizado) => {
    setUser(usuarioActualizado);
    localStorage.setItem("gti_user", JSON.stringify(usuarioActualizado));
  };
  const handleStartNavigation = (punto) => {
    setNavTarget(punto);
    setActiveTab("inicio");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("gti_user");
    setActiveTab("inicio");
  };

  // 🔥 SOLUCIÓN SENIOR: En lugar de un useEffect con "setActiveTab",
  // decidimos QUÉ mostrar antes de entrar al return.
  const esRutaPublica = ["inicio", "registro", "login"].includes(activeTab);

  // Si intenta entrar a una privada sin usuario, mostramos el "inicio" por defecto
  // pero sin disparar un setStatus infinito.
  const tabRealAMostrar = !user && !esRutaPublica ? "inicio" : activeTab;

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans pb-20 text-slate-900">
      <Navbar
        activeTab={tabRealAMostrar} // Pasamos el tab verificado
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <main className="max-w-[1400px] mx-auto p-6 md:p-10">
        {/* --- MODULOS SIEMPRE DISPONIBLES O PÚBLICOS --- */}
        {tabRealAMostrar === "inicio" && (
          <ModuloInicio
            navTarget={navTarget}
            clearNav={() => setNavTarget(null)}
          />
        )}

        {tabRealAMostrar === "registro" && (
          <Registro
            onBack={() => setActiveTab("login")}
            onRegSuccess={() => setActiveTab("login")}
          />
        )}

        {tabRealAMostrar === "login" && (
          <Login
            onRegister={() => setActiveTab("registro")}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* --- MODULOS PROTEGIDOS GTI-3 (Solo si existe 'user') --- */}
        {user && (
          <>
            {tabRealAMostrar === "dashboard" && (
              <DashboardMaestro user={user} setActiveTab={setActiveTab} />
            )}

            {tabRealAMostrar === "puntos" && (
              <PuntosRecoleccion onNavigate={handleStartNavigation} />
            )}

            {/* Blindaje por rol */}
            {tabRealAMostrar === "catalogo" && user.rol !== "ENCARGADO" && (
              <CatalogoPremios user={user} setUsuario={updateBalanceSilently} />
            )}

            {tabRealAMostrar === "historial" && (
              <HistorialActividad user={user} />
            )}

            {tabRealAMostrar === "perfil" && <PaginaPerfil user={user} />}

            {tabRealAMostrar === "manual" && user.rol === "ENCARGADO" && (
              <PanelEncargado user={user} />
            )}

            {tabRealAMostrar === "admin" && <AdminPanel />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
