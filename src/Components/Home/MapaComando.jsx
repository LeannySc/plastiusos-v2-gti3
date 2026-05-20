import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapPin, Navigation2 } from "lucide-react";

import { toast } from "sonner";

// 📍 Foco inicial en Popayán
const POPAYAN_CENTER = [2.4419, -76.6063];

// 🛰️ Mueve la cámara automáticamente
const ChangeView = ({ center }) => {
  const map = useMap();

  if (center) {
    map.flyTo(center, 16, {
      animate: true,
      duration: 2,
    });
  }

  return null;
};

// 🎨 Marcador dinámico
const createCustomIcon = (color) =>
  new L.divIcon({
    className: "custom-div-icon",
    html: `
      <div
        style="background-color:${color};"
        class="
          w-5
          h-5
          rounded-full
          border-2
          border-white
          shadow-xl
          scale-125
          animate-pulse
        "
      ></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

const MapaComando = ({
  onSelectPunto,
  puntosData = [],
  navTarget,
  clearNav,
}) => {
  const [userPos, setUserPos] = useState(null);

  // 📡 GPS cuando hay misión (Solución GTI contra Cascading Renders)
  useEffect(() => {
    if (navTarget) {
      const geoId = navigator.geolocation.watchPosition(
        // 💡 Senior Tip: Usamos watchPosition para que la flecha se mueva mientras caminas
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          toast.error("Por favor activa permisos GPS");
        },
        {
          enableHighAccuracy: true,
        },
      );

      // Limpieza: Cuando el componente se destruye o el target cambia, dejamos de gastar batería en el GPS
      return () => navigator.geolocation.clearWatch(geoId);
    } else {
      // ✅ FIX: queueMicrotask evita el renderizado síncrono que rompe el sistema
      queueMicrotask(() => {
        if (userPos !== null) {
          // Solo actualiza si realmente hay algo que borrar
          setUserPos(null);
        }
      });
    }
  }, [navTarget]); // Quitamos userPos de las dependencias para evitar bucle infinito

  return (
    <div className="h-full w-full relative rounded-[45px] overflow-hidden border-4 border-white shadow-2xl">
      {/* 🧭 HUD navegación */}
      {navTarget && userPos && (
        <div
          className="
          absolute
          top-6
          left-1/2
          -translate-x-1/2
          z-[1000]
          bg-[#111827]
          text-white
          px-8
          py-4
          rounded-3xl
          shadow-2xl
          flex
          items-center
          gap-5
          border
          border-emerald-500
          animate-in
          slide-in-from-top-10
          "
        >
          <div
            className="
            p-2
            bg-emerald-500
            rounded-xl
            animate-pulse
            "
          >
            <Navigation2 size={18} />
          </div>

          <div>
            <p
              className="
              text-[8px]
              font-black
              uppercase
              text-emerald-400
              "
            >
              Navegación Activa
            </p>

            <h4
              className="
              text-[11px]
              font-bold
              uppercase
              truncate
              max-w-[180px]
              "
            >
              Destino: {navTarget.nombre}
            </h4>
          </div>

          <button
            onClick={clearNav}
            className="
            ml-4
            p-2
            bg-white/10
            hover:bg-red-500
            rounded-full
            transition-all
            text-xs
            font-black
            uppercase
            "
          >
            Salir
          </button>
        </div>
      )}

      <MapContainer
        center={POPAYAN_CENTER}
        zoom={15}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {/* 📷 Centrado automático */}
        {navTarget && <ChangeView center={userPos} />}

        {/* 👤 Usuario */}
        {userPos && (
          <Marker position={userPos} icon={createCustomIcon("#3b82f6")}>
            <Popup className="font-black uppercase italic">Tú estás aquí</Popup>
          </Marker>
        )}

        {/* 🛣️ Ruta visual */}
        {userPos && navTarget && (
          <Polyline
            positions={[userPos, [navTarget.latitud, navTarget.longitud]]}
            pathOptions={{
              color: "#10b981",
              weight: 4,
              dashArray: "10,10",
              opacity: 0.8,
            }}
          />
        )}

        {/* ♻️ Botes */}
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
            eventHandlers={{
              click: () => onSelectPunto(punto),
            }}
          >
            <Popup>
              <div className="p-4 space-y-3 min-w-[200px]">
                {/* Cabecera */}
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-emerald-500 mt-0.5" />

                  <div>
                    <h4 className="font-black uppercase italic text-xs text-gray-800 leading-tight">
                      {punto.nombre}
                    </h4>

                    <p className="text-[10px] text-gray-400 font-bold mb-2">
                      {punto.direccion}
                    </p>

                    {/* Materiales */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {punto.materiales && punto.materiales.length > 0 ? (
                        punto.materiales.map((mat, idx) => (
                          <span
                            key={idx}
                            className="
                              bg-gray-100
                              text-gray-500
                              text-[8px]
                              font-black
                              px-2
                              py-0.5
                              rounded-md
                              border
                              border-gray-200
                              uppercase
                              tracking-tighter
                              "
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

                {/* Estado */}
                <div className="bg-emerald-50 p-2 rounded-xl flex justify-between items-center border border-emerald-100">
                  <span className="text-[9px] font-black uppercase text-emerald-700 italic">
                    Estado Real
                  </span>

                  <span className="text-[10px] font-black text-emerald-600 uppercase">
                    {punto.estadoBote}
                  </span>
                </div>

                {/* Barra */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase italic">
                    <span>Llenado</span>

                    <span className="text-emerald-600">
                      {punto.nivelLlenado}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="
                      h-full
                      bg-emerald-500
                      transition-all
                      duration-1000
                      shadow-[0_0_8px_rgba(16,185,129,0.4)]
                      "
                      style={{
                        width: `${punto.nivelLlenado}%`,
                      }}
                    />
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
