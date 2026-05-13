import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// 🌈 Paleta de colores industrial GTI-3
const COLORES_GTI = ["#10b981", "#3b82f6", "#f59e0b", "#a855f7", "#ef4444"];

const ChartsSection = ({ data }) => {
  // 🛡️ Seguridad GTI: Verificación de data
  if (!data || !data.historicoMensual || !data.distribucionMateriales) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 bg-white p-20 rounded-[45px] text-center text-gray-300 font-black italic uppercase border-2 border-dashed border-gray-100">
          Sincronizando flujo de materiales...
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 📊 1. GRÁFICA DE BARRAS (Kg por día) */}
      <div
        className="lg:col-span-2 bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm"
        style={{ minHeight: "450px" }}
      >
        <h3 className="text-xl font-bold text-gray-900 italic tracking-tight mb-8 uppercase">
          Kg Recuperados por Día
        </h3>
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.historicoMensual}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: "bold", fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: "bold", fill: "#94a3b8" }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "20px",
                  border: "none",
                  boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="kg"
                fill="#10b981"
                radius={[10, 10, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🍩 2. GRÁFICA DE DONA (Mix de Materiales Real) */}
      <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm flex flex-col h-full">
        <h3 className="text-xl font-bold text-gray-900 italic tracking-tight mb-8 uppercase text-center">
          Mix de Materiales
        </h3>

        <div style={{ width: "100%", height: "220px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.distribucionMateriales}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {data.distribucionMateriales.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORES_GTI[index % COLORES_GTI.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "15px",
                  border: "none",
                  boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LEYENDAS DINÁMICAS */}
        <div className="mt-6 space-y-3">
          {data.distribucionMateriales.length > 0 ? (
            data.distribucionMateriales.map((mat, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-[10px] font-black uppercase italic"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: COLORES_GTI[i % COLORES_GTI.length],
                    }}
                  />
                  <span className="text-gray-500 tracking-tighter">
                    {mat.name}
                  </span>
                </div>
                <span className="text-emerald-600">{mat.value} kg</span>
              </div>
            ))
          ) : (
            <p className="text-center text-[10px] text-gray-300 font-bold uppercase italic mt-10">
              Sin datos de clasificación
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
