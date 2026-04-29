import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const dataMensual = [
  { name: "Oct", kg: 3200 },
  { name: "Nov", kg: 3800 },
  { name: "Dic", kg: 2800 },
  { name: "Ene", kg: 3400 },
  { name: "Feb", kg: 4500 },
  { name: "Mar", kg: 4000 },
];

const dataMateriales = [
  { name: "Plástico PET", value: 38, color: "#3b82f6" },
  { name: "Cartón", value: 25, color: "#f59e0b" },
  { name: "Vidrio", value: 15, color: "#10b981" },
  { name: "Metal", value: 12, color: "#64748b" },
  { name: "Papel", value: 7, color: "#eab308" },
  { name: "Electrónicos", value: 3, color: "#a855f7" },
];

const ChartsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Gráfica de Líneas (70%) */}
      <div className="lg:col-span-2 bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-gray-900 italic tracking-tight">
            Kg Reciclados por Mes
          </h3>
          <span className="text-emerald-500 text-xs font-black italic">
            ↗ +18% vs mes anterior
          </span>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataMensual}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "20px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="kg"
                stroke="#10b981"
                strokeWidth={4}
                dot={{ r: 6, fill: "#10b981" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfica de Dona (30%) */}
      <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 italic tracking-tight mb-8">
          Distribución de Materiales
        </h3>
        <div className="h-[250px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataMateriales}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dataMateriales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {dataMateriales.map((mat, i) => (
            <div
              key={i}
              className="flex justify-between items-center text-[10px] font-bold"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: mat.color }}
                />{" "}
                {mat.name}
              </div>
              <span>{mat.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
