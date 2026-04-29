import { useState, useEffect } from "react";
import { Search, Star, Loader2 } from "lucide-react";
import CanjeModal from "./Catalog/CanjeModal";
import SuccessModal from "./Catalog/SuccessModal";
import { API_BASE_URL } from "../api/config"; // Importante para local:8080

const CatalogoPremios = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successName, setSuccessName] = useState("");

  // 🔥 1. Cargar productos desde tu PostgreSQL (ProductoRepository)
  useEffect(() => {
    fetch(`${API_BASE_URL}/canje/catalogo`)
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando catálogo local:", err);
        setLoading(false);
      });
  }, []);

  // 🔥 2. Lógica de Canje Real vinculada a CanjeController.java
  const handleConfirmCanje = async (producto) => {
    try {
      // Usamos el ID de usuario 1 por ahora (Simulando login de Maria García)
      const userId = 1;
      const res = await fetch(
        `${API_BASE_URL}/canje/realizar?userId=${userId}&productoId=${producto.id}&direccion=Sede Principal Popayán`,
        { method: "POST" },
      );

      if (res.ok) {
        setSelectedProduct(null);
        setSuccessName(producto.nombre);
        setShowSuccess(true);

        // Refrescamos productos para ver el nuevo stock (singleton stock gestionado en Java)
        const refreshRes = await fetch(`${API_BASE_URL}/canje/catalogo`);
        const refreshData = await refreshRes.json();
        setProductos(refreshData);
      } else {
        const errorData = await res.json();
        alert(`Fallo de protocolo: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Fallo crítico en canje:", err);
    }
  };

  // 🔥 3. Filtrado reactivo

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda = p.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    // Comprobamos la categoría (Si tu Java aún no tiene categoría, por ahora asume que todos coinciden)
    const coincideCategoria =
      activeCategory === "Todas" || p.categoria === activeCategory;

    return coincideBusqueda && coincideCategoria && p.activo;
  });

  if (loading)
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
            Catálogo de Premios
          </h1>
          <p className="text-gray-400 mt-2 font-medium italic">
            Artículos sincronizados desde la base de datos industrial GTI-3.
          </p>
        </div>
        <div className="bg-emerald-50 px-6 py-3 rounded-[25px] border border-emerald-100 flex items-center gap-4 shadow-sm">
          <Star className="text-emerald-500 fill-current" size={20} />
          <span className="text-emerald-600 font-black italic text-lg leading-none">
            1.240{" "}
            <span className="text-xs uppercase font-medium">
              pts disponibles
            </span>
          </span>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y CATEGORÍAS */}
      <div className="bg-white p-5 rounded-[40px] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative flex-grow w-full group">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar premios en la red..."
            className="w-full pl-16 pr-6 py-4 rounded-3xl bg-gray-50 border-none outline-none font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>{" "}
        {/* 🟢 AQUÍ ACTIVAMOS activeCategory PARA QUITAR EL ERROR */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            "Todas",
            "Hogar",
            "Cocina",
            "Jardín",
            "Oficina",
            "Cuidado Personal",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic tracking-widest transition-all
        ${
          activeCategory === cat
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 active:scale-95"
            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
        }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DINÁMICO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {productosFiltrados.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-[45px] border border-gray-50 overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col"
          >
            <div className="relative h-60 w-full overflow-hidden">
              <img
                src={
                  product.imagenUrl ||
                  "https://images.unsplash.com/photo-1610473068541-1f91b7d5612c?q=80&w=500&auto=format&fit=crop"
                }
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
              />
              <span className="absolute top-4 right-6 px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                Stock: {product.stock}
              </span>
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <h3 className="font-black italic text-gray-900 leading-tight uppercase text-lg group-hover:text-emerald-600">
                {product.nombre}
              </h3>
              <p className="text-[11px] text-gray-400 font-medium italic mt-2 line-clamp-2">
                {product.descripcion}
              </p>

              <div className="flex items-end justify-between mt-auto pt-8 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-300 uppercase italic">
                    Requisito
                  </span>
                  <span className="font-black italic text-xl text-emerald-500">
                    {product.costoPuntos}{" "}
                    <span className="text-[9px] uppercase font-bold">pts</span>
                  </span>
                </div>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="px-6 py-3 bg-[#f0fdf4] text-emerald-600 font-black italic uppercase text-[10px] rounded-full tracking-[0.1em] hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                >
                  Canjear
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CanjeModal
        isOpen={!!selectedProduct}
        product={selectedProduct}
        userPoints={1240} // Esto luego vendrá del AuthContext real
        onClose={() => setSelectedProduct(null)}
        onConfirm={handleConfirmCanje}
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        productoNombre={successName}
      />
    </div>
  );
};

export default CatalogoPremios;
