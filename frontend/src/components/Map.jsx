import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los íconos de Leaflet en producción
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para centrar el mapa
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export const Map = ({ vendedores = [], center = [14.6349, -90.5069], zoom = 13, onMarkerClick }) => {
  // Crear íconos personalizados
  const availableIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const unavailableIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%', minHeight: '400px' }}
      className="rounded-lg shadow-lg"
    >
      <ChangeView center={center} zoom={zoom} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {vendedores.map((vendedor) => {
        const position = [
          vendedor.ubicacionActual?.coordinates[1] || 14.6349,
          vendedor.ubicacionActual?.coordinates[0] || -90.5069
        ];

        return (
          <Marker
            key={vendedor._id}
            position={position}
            icon={vendedor.disponible ? availableIcon : unavailableIcon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(vendedor)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-1">{vendedor.nombreNegocio}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {vendedor.descripcion || 'Sin descripción'}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    vendedor.disponible 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vendedor.disponible ? '✓ Disponible' : '✗ No disponible'}
                  </span>
                  <span className="text-sm text-gray-500">
                    📦 {vendedor.productos?.length || 0} productos
                  </span>
                </div>
                {vendedor.userId && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      👤 {vendedor.userId.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      📞 {vendedor.userId.telefono}
                    </p>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};
