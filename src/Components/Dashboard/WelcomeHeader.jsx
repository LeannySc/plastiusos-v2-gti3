import { Star, Recycle, Package, ShoppingBag } from "lucide-react";

const WelcomeHeader = ({ user = { nombre: "María" } }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none flex items-center gap-3">
          ¡Hola, {user.nombre}! <span className="animate-bounce">👋</span>
        </h1>
        <p className="text-gray-400 mt-2 font-medium italic">
          Resumen de tu actividad de reciclaje.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem
          icon={Star}
          label="Puntos Disponibles"
          value="1.240"
          sub="+280 esta semana"
          color="text-emerald-500"
          bg="bg-emerald-50"
        />
        <StatItem
          icon={Recycle}
          label="Kg Reciclados"
          value="63 kg"
          sub="Total acumulado"
          color="text-blue-500"
          bg="bg-blue-50"
        />
        <StatItem
          icon={Package}
          label="Entregas Realizadas"
          value="5"
          sub="3 aprobadas"
          color="text-amber-500"
          bg="bg-amber-50"
        />
        <StatItem
          icon={ShoppingBag}
          label="Canjes Realizados"
          value="2"
          sub="1 en proceso"
          color="text-purple-500"
          bg="bg-purple-50"
        />
      </div>
    </div>
  );
};

const StatItem = ({ icon: Icon, label, value, sub, color, bg }) => (
  <div
    className={`p-8 rounded-[40px] border border-gray-100 shadow-sm ${bg} transition-transform hover:scale-105 cursor-default`}
  >
    <div
      className={`w-12 h-12 rounded-2xl ${color} bg-white flex items-center justify-center mb-4 shadow-sm`}
    >
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <h3
      className={`text-4xl font-black italic tracking-tighter ${color} leading-none`}
    >
      {value}
    </h3>
    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-3">
      {label}
    </p>
    <p className="text-[9px] font-bold text-gray-400 italic mt-1">{sub}</p>
  </div>
);

export default WelcomeHeader;
