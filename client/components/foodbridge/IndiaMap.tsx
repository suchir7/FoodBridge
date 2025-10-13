import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";

export default function IndiaMap({ markers = [], height = 360 }) {
  // Center on India (roughly near Nagpur)
  const indiaCenter = useMemo(() => ({ lat: 21.146633, lng: 79.08886 }), []);

  // Default Leaflet icon fix for bundlers
  const defaultIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        iconSize: [25, 41],
        shadowSize: [41, 41],
      }),
    []
  );

  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-xl border border-border/60">
      <MapContainer center={indiaCenter} zoom={5} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((m) => (
          <Marker key={m.id} position={[m.position.lat, m.position.lng]} icon={defaultIcon}>
            {m.label ? <Popup>{m.label}</Popup> : null}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


