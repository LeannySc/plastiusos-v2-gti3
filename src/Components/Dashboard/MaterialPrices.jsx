const PRECIOS_TABLA = [
  {
    mat: "Plástico PET",
    pts: "15 pts/kg",
    img: "https://cdn-icons-png.flaticon.com/128/1922/1922097.png",
    color: "text-emerald-500",
  },
  {
    mat: "Cartón",
    pts: "10 pts/kg",
    img: "https://cdn-icons-png.flaticon.com/128/1149/1149254.png",
    color: "text-emerald-500",
  },
  {
    mat: "Vidrio",
    pts: "8 pts/kg",
    img: "https://cdn-icons-png.flaticon.com/128/3468/3468449.png",
    color: "text-emerald-500",
  },
  {
    mat: "Metal / Lata",
    pts: "20 pts/kg",
    img: "https://cdn-icons-png.flaticon.com/128/1824/1824559.png",
    color: "text-emerald-500",
  },
  {
    mat: "Papel",
    pts: "5 pts/kg",
    img: "https://cdn-icons-png.flaticon.com/128/2900/2900898.png",
    color: "text-emerald-500",
  },
  {
    mat: "Electrónicos",
    pts: "50 pts/kg",
    img: "https://cdn-icons-png.flaticon.com/128/2382/2382461.png",
    color: "text-emerald-500",
  },
];

const MaterialPrices = () => (
  <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm">
    <h3 className="text-xl font-bold text-gray-900 italic tracking-tight mb-6">
      Tabla de Puntos por Material
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      {PRECIOS_TABLA.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center bg-gray-50/50 p-4 rounded-[30px] border border-gray-50"
        >
          <img
            src={item.img}
            alt={item.mat}
            className="w-10 h-10 object-contain mb-3"
          />
          <p className="text-[10px] font-black uppercase text-gray-400 italic text-center leading-tight mb-1">
            {item.mat}
          </p>
          <span className={`${item.color} font-black italic text-[11px]`}>
            {item.pts}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default MaterialPrices;
