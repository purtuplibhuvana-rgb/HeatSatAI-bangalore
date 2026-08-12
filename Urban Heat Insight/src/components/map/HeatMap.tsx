import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Rectangle, CircleMarker, Tooltip, LayersControl, useMap } from "react-leaflet";
import { BENGALURU_CENTER, heatHex, type Hotspot, type GridCell } from "@/lib/mock-data";

function FlyToController({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 14, { duration: 0.8 });
  }, [target, map]);
  return null;
}

interface HeatMapProps {
  hotspots: Hotspot[];
  gridCells: GridCell[];
  onSelect: (h: Hotspot) => void;
  focus: [number, number] | null;
  minTemp: number;
  maxTemp: number;
}

export default function HeatMap({ hotspots, gridCells, onSelect, focus, minTemp, maxTemp }: HeatMapProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">Loading map…</div>;

  const cellSize = 0.012 / 2;

  return (
    <MapContainer
      center={BENGALURU_CENTER}
      zoom={11}
      className="h-full w-full rounded-xl"
      style={{ background: "#0b1220" }}
      scrollWheelZoom
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Dark">
          <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Street">
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Terrain">
          <TileLayer
            attribution="&copy; OpenTopoMap"
            url="https://a.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay checked name="Prediction Grid">
          <>{gridCells.filter(c => c.lst >= minTemp && c.lst <= maxTemp).map(cell => (
            <Rectangle
              key={cell.id}
              bounds={[[cell.lat - cellSize, cell.lng - cellSize],[cell.lat + cellSize, cell.lng + cellSize]]}
              pathOptions={{
                color: heatHex(cell.category),
                fillColor: heatHex(cell.category),
                fillOpacity: 0.45,
                weight: 0,
              }}
            >
              <Tooltip direction="top" opacity={0.9}>
                <div className="text-xs">
                  <div className="font-semibold">{cell.lst.toFixed(1)}°C</div>
                  <div className="opacity-70 capitalize">{cell.category}</div>
                </div>
              </Tooltip>
            </Rectangle>
          ))}</>
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Hotspots">
          <>{hotspots.filter(h => h.lst >= minTemp && h.lst <= maxTemp).slice(0, 80).map(h => (
            <CircleMarker
              key={h.id}
              center={[h.lat, h.lng]}
              radius={5}
              pathOptions={{
                color: heatHex(h.category),
                fillColor: heatHex(h.category),
                fillOpacity: 0.9,
                weight: 1.5,
              }}
              eventHandlers={{ click: () => onSelect(h) }}
            >
              <Tooltip direction="top">
                <div className="text-xs">
                  <div className="font-semibold">{h.name}</div>
                  <div>{h.lst.toFixed(1)}°C · {h.category}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}</>
        </LayersControl.Overlay>
      </LayersControl>

      <FlyToController target={focus} />
    </MapContainer>
  );
}