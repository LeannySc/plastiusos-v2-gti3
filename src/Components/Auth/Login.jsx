import { useState } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { API_BASE_URL } from "../../api/config";
import { toast, Toaster } from "sonner";

// Molde de Input Premium interno para evitar errores de definición
const InputGTI = ({
  label,
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
}) => (
  <div className="space-y-2 group text-left">
    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors">
        <Icon size={18} />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-100 pl-14 pr-6 py-4 rounded-[22px] text-sm font-bold text-gray-700 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
        required
      />
    </div>
  </div>
);

const Login = ({ onRegister, onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    correo: "",
    contrasena: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/identidad/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Credenciales no autorizadas");
      }

      const userData = await response.json();
      onLoginSuccess(userData);
      toast.success(`Acceso concedido: ${userData.nombre}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in zoom-in duration-500">
      <Toaster position="top-right" richColors />
      <div className="bg-white rounded-[50px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-50">
        {/* LADO IZQUIERDO: Branding */}
        <div className="w-full md:w-5/12 bg-emerald-500 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <Leaf size={24} fill="white" />
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white">
              Acceso Seguro
            </h2>
            <p className="mt-6 text-emerald-50 text-sm font-medium italic opacity-90">
              Terminal industrial GTI-3 sincronizada con Popayán.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 bg-black/10 p-4 rounded-3xl backdrop-blur-sm border border-white/10">
            <ShieldCheck className="text-white" size={20} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white leading-none">
              Capa de Seguridad Local Activa
            </p>
          </div>
        </div>

        {/* LADO DERECHO: Formulario */}
        <div className="w-full md:w-7/12 p-12 lg:p-16 bg-white">
          <div className="mb-10">
            <h3 className="text-2xl font-black italic text-gray-900 uppercase">
              Bienvenido de nuevo
            </h3>
            <p className="text-gray-400 text-sm font-medium italic">
              Ingresa a tu cuenta de operario
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputGTI
              label="Correo"
              icon={Mail}
              type="email"
              placeholder="operario@gti.com"
              value={credentials.correo}
              onChange={(val) =>
                setCredentials({ ...credentials, correo: val })
              }
            />
            <InputGTI
              label="Contraseña"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              value={credentials.contrasena}
              onChange={(val) =>
                setCredentials({ ...credentials, contrasena: val })
              }
            />

            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-[#111827] text-white rounded-full font-black italic uppercase text-xs tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Ingresar al sistema"
              )}{" "}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-50 pt-8">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic">
              ¿Aún no eres operario?{" "}
              <button
                onClick={onRegister}
                className="ml-2 text-emerald-500 hover:underline"
              >
                Regístrate
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
