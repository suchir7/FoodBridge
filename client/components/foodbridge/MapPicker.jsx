import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

// Fix for default marker icon
const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function LocationMarker({ position, onChange }) {
    const map = useMapEvents({
        click(e) {
            onChange(e.latlng);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, 16);
        }
    }, [position, map]);

    return position ? <Marker position={position} icon={defaultIcon} /> : null;
}

export default function MapPicker({ value, onChange, className }) {
    // Default center: India (Nagpur)
    const [center] = useState({ lat: 21.1458, lng: 79.0882 });
    const [markerPos, setMarkerPos] = useState(null);

    useEffect(() => {
        if (value && value.lat && value.lng) {
            console.log("📍 MapPicker received value:", value);
            setMarkerPos({ lat: value.lat, lng: value.lng });
        }
    }, [value]);

    const handleLocationChange = (latlng) => {
        setMarkerPos(latlng);
        onChange({ lat: latlng.lat, lng: latlng.lng });
    };

    return (
        <div className={cn("h-[300px] w-full overflow-hidden rounded-xl border border-border/60 z-0", className)}>
            <MapContainer center={center} zoom={5} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={markerPos} onChange={handleLocationChange} />
            </MapContainer>
            <div className="mt-2 text-xs text-muted-foreground text-center">
                {markerPos ? `Selected: ${markerPos.lat.toFixed(4)}, ${markerPos.lng.toFixed(4)}` : "Click on the map to select a location"}
            </div>
        </div>
    );
}
