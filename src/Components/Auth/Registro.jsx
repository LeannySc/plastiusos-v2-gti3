import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Key,
  Loader2,
} from "lucide-react";
import { API_BASE_URL } from "../../api/config";
import { toast, Toaster } from "sonner";

// Molde de Input interno (Sincronizado con estilo Login)
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
        className="w-full bg-gray-50 border border-gray-100 pl-14 pr-6 py-4 rounded-[22px] text-sm font-bold text-gray-700 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300 placeholder:italic"
        required
      />
    </div>
  </div>
);

const Registro = ({ onBack, onRegSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    telefono: "",
    rol: "RECICLADOR",
  });
  const [pin, setPin] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fullData = {
      ...form,
      nombre: `${form.nombre} ${form.apellido}`.trim(),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/identidad/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullData),
      });
      if (!res.ok) throw new Error("Email ya en uso o fallo de servidor");
      setStep(2);
      toast.info("HU-01: PIN generado en logs industriales.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${API_BASE_URL}/identidad/verificar?correo=${form.correo}&codigo=${pin}`,
        { method: "POST" },
      );
      const exito = await res.json();
      if (exito) {
        toast.success("¡Identidad blindada y activada!");
        setTimeout(onRegSuccess, 1500);
      } else {
        toast.error("PIN incorrecto.");
      }
    } catch (err) {
      toast.error("Error de sincronización", err);
    }
  };

  // VISTA DE PASO 2: PIN DE SEGURIDAD
  if (step === 2)
    return (
      <div className="max-w-md mx-auto py-20 animate-in fade-in zoom-in duration-300">
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Key size={32} />
          </div>
          <h3 className="text-2xl font-black italic uppercase text-gray-900 leading-tight">
            Capa 2: Blindaje
          </h3>
          <p className="text-gray-400 text-xs mt-3 italic font-medium leading-relaxed px-4">
            Introduce el código industrial que se imprimió en tus logs de Java.
          </p>
          <form onSubmit={handleVerificar} className="mt-8 space-y-5">
            <input
              maxLength={6}
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="000000"
              className="w-full text-center text-4xl font-black tracking-[0.5em] py-6 bg-gray-50 rounded-[30px] border-2 border-emerald-50 outline-none focus:bg-white focus:border-emerald-400 transition-all text-emerald-600"
            />
            <button
              type="submit"
              className="w-full py-5 bg-[#111827] text-white rounded-full font-black uppercase text-xs hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
            >
              Verificar mi Cuenta
            </button>
          </form>
        </div>
      </div>
    );

  // VISTA DE PASO 1: DATOS (REPARADO ESTÉTICAMENTE 🎨)
  return (
    <div className="max-w-5xl mx-auto py-12 animate-in fade-in zoom-in duration-700">
      <Toaster position="top-right" richColors />
      <div className="bg-white rounded-[50px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-50 min-h-[600px]">
        {/* LADO IZQUIERDO: Branding (Misma estructura que Login) */}
        <div className="w-full md:w-5/12 bg-emerald-500 p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <Leaf size={24} fill="white" />
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
              Únete al cambio
            </h2>
            <p className="mt-6 text-emerald-50 text-sm font-medium italic opacity-90 leading-relaxed">
              Crea tu identificación única en el ecosistema GTI-3 y comienza a
              registrar cada kilo reciclado.
            </p>
          </div>

          <div className="relative z-10 bg-black/10 p-6 rounded-[30px] border border-white/10 backdrop-blur-sm">
            <ShieldCheck className="text-white mb-3" size={28} />
            <p className="text-[11px] font-black uppercase tracking-widest text-white leading-tight">
              Cada entrega es auditada y convertida en valor industrial.
            </p>
          </div>

          {/* Efecto blur de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/30 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/10 rounded-full"></div>
        </div>

        {/* LADO DERECHO: Formulario Dinámico */}
        <div className="w-full md:w-7/12 p-12 lg:p-16 bg-white flex flex-col justify-center">
          <div className="mb-10 text-left">
            <h3 className="text-2xl font-black italic text-gray-900 uppercase tracking-tighter">
              Crear Cuenta Industrial
            </h3>
            <p className="text-gray-400 text-sm font-medium italic mt-1">
              Completa tu registro para continuar
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <InputGTI
              label="Nombre Operario"
              icon={User}
              type="text"
              placeholder="Salvador D."
              value={form.nombre}
              onChange={(v) => setForm({ ...form, nombre: v })}
            />

            <InputGTI
              label="Apellido Operario"
              icon={User}
              type="text"
              placeholder="Gómez"
              value={form.apellido}
              onChange={(v) => setForm({ ...form, apellido: v })}
            />

            <InputGTI
              label="Correo de Sistema"
              icon={Mail}
              type="email"
              placeholder="operario@gti.com"
              value={form.correo}
              onChange={(v) => setForm({ ...form, correo: v })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGTI
                label="Teléfono"
                icon={Phone}
                type="text"
                placeholder="300"
                value={form.telefono}
                onChange={(v) => setForm({ ...form, telefono: v })}
              />
              {/*  */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                  Elegir Función
                </label>
                <select
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-4 rounded-2xl text-sm font-black uppercase italic text-emerald-600 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer"
                >
                  <option value="RECICLADOR">RECICLADOR (Ciudadano)</option>
                  <option value="ENCARGADO">ENCARGADO (Operario Punto)</option>
                </select>
              </div>
              <InputGTI
                label="Contraseña"
                icon={Lock}
                type="password"
                placeholder="••••"
                value={form.contrasena}
                onChange={(v) => setForm({ ...form, contrasena: v })}
              />
            </div>

            <div className="pt-6">
              <button
                disabled={loading}
                type="submit"
                className="w-full py-5 bg-[#111827] text-white rounded-[25px] font-black italic uppercase text-xs flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-600 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Generar Identidad"
                )}{" "}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <button
              onClick={onBack}
              className="text-[11px] font-black text-gray-400 hover:text-emerald-500 uppercase italic tracking-[0.2em] transition-colors"
            >
              ¿Ya tienes cuenta? Ingresar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
