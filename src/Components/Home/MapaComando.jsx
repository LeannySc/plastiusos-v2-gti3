import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
// Foco inicial en Popayán
const POPAYAN_CENTER = [2.4419, -76.6063];

const createCustomIcon = (color) =>
  new L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color};" class="w-5 h-5 rounded-full border-2 border-white shadow-xl scale-125 animate-pulse"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

const MapaComando = ({ onSelectPunto, puntosData = [] }) => {
  return (
    <div className="h-full w-full rounded-[45px] overflow-hidden border-4 border-white shadow-2xl relative z-0">
      <MapContainer
        center={POPAYAN_CENTER}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        dragging={true}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {puntosData.map((punto) => (
          <Marker
            key={punto.id}
            position={[punto.latitud, punto.longitud]}
            icon={createCustomIcon(
              punto.estadoBote === "LLENO" || punto.nivelLlenado > 80
                ? "#ef4444"
                : punto.nivelLlenado > 40
                  ? "#f59e0b"
                  : "#10b981",
            )}
            eventHandlers={{ click: () => onSelectPunto(punto) }}
          >
            <Popup>
              <div className="p-4 space-y-3 min-w-[200px]">
                {/* CABECERA */}
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-emerald-500 mt-0.5" />
                  <div>
                    <h4 className="font-black uppercase italic text-xs text-gray-800 leading-tight">
                      {punto.nombre}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold mb-2">
                      {punto.direccion}
                    </p>

                    {/* ✅ NUEVO: LISTA DE MATERIALES ACEPTADOS */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {punto.materiales && punto.materiales.length > 0 ? (
                        punto.materiales.map((mat, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-500 text-[8px] font-black px-2 py-0.5 rounded-md border border-gray-200 uppercase tracking-tighter"
                          >
                            ♻️ {mat.nombre}
                          </span>
                        ))
                      ) : (
                        <span className="text-[8px] text-gray-300 italic">
                          No hay perfiles de carga
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ESTADO REAL */}
                <div className="bg-emerald-50 p-2 rounded-xl flex justify-between items-center border border-emerald-100">
                  <span className="text-[9px] font-black uppercase text-emerald-700 italic">
                    Estado Real
                  </span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase">
                    {punto.estadoBote}
                  </span>
                </div>

                {/* BARRA DE LLENADO */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase italic">
                    <span>Llenado</span>
                    <span className="text-emerald-600">
                      {punto.nivelLlenado}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                      style={{ width: `${punto.nivelLlenado}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapaComando;
