import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState, useEffect } from "react";
import { MapPin, Thermometer, Layers, Filter as FilterIcon, X } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { HeatLegend } from "@/components/dashboard/HeatLegend";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientOnly } from "@/components/map/ClientOnly";
import { heatHex, type Hotspot, type GridCell } from "@/lib/mock-data";

import { fetchHeatmap, fetchHotspots } from "@/lib/api";
const HeatMapComponent = lazy(() => import("@/components/map/HeatMap"));



export const Route = createFileRoute("/heat-map")({
  head: () => ({
    meta: [
      { title: "Interactive Heat Map · HeatSatAI" },
      { name: "description", content: "Interactive Leaflet map with prediction grid, hotspot markers and click-through details for Bengaluru." },
    ],
  }),
  component: HeatMapPage,
});

function HeatMapPage() {
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const [focus, setFocus] = useState<[number, number] | null>(null);
  const [query, setQuery] = useState("");
  const [tempRange, setTempRange] = useState<[number, number]>([24, 48]);
  const [landCover, setLandCover] = useState<string>("all");
  
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [gridCells, setGridCells] = useState<GridCell[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    Promise.all([fetchHotspots(), fetchHeatmap()]).then(([hots, grids]) => {
      setHotspots(hots);
      setGridCells(grids);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const results = hotspots.filter(h =>
    (query.trim() === "" || h.name.toLowerCase().includes(query.toLowerCase())) &&
    h.lst >= tempRange[0] && h.lst <= tempRange[1] &&
    (landCover === "all" || h.landCover === landCover)
  ).slice(0, 8);

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1600px] space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Interactive Heat Map</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Predicted LST grid and hotspot markers · click any cell or marker for details.
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/10 text-primary">
            <Layers className="h-3 w-3" /> 3 layers active
          </Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-[280px_1fr_320px]">
          {/* Filters */}
          <div className="space-y-4">
            <SectionCard title="Filters" subtitle="Refine visible cells & hotspots">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium">Search</label>
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Neighborhood…"
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-medium">Temperature</span>
                    <span className="tabular-nums text-muted-foreground">{tempRange[0]}–{tempRange[1]}°C</span>
                  </div>
                  <Slider
                    min={24} max={48} step={1}
                    value={tempRange}
                    onValueChange={(v) => setTempRange([v[0], v[1]] as [number, number])}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium">Land Cover</label>
                  <Select value={landCover} onValueChange={setLandCover}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All classes</SelectItem>
                      <SelectItem value="urban">Urban</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="vegetation">Vegetation</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="barren">Barren</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    { label: "Hotspot Lvl", value: "Auto" },
                    { label: "NDVI", value: "0.0–1.0" },
                    { label: "NDBI", value: "0.0–1.0" },
                    { label: "Population", value: "All" },
                  ].map(f => (
                    <div key={f.label} className="rounded-md border border-border/60 bg-muted/30 p-2">
                      <div className="text-muted-foreground">{f.label}</div>
                      <div className="font-medium">{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            <HeatLegend />
          </div>

          {/* Map */}
          <div className="glass relative h-[640px] overflow-hidden rounded-xl p-1">
            <ClientOnly fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading map…</div>}>
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading map data...</div>
              ) : (
                <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading map component…</div>}>
                  <HeatMapComponent
                    hotspots={hotspots}
                    gridCells={gridCells}
                    onSelect={(h) => { setSelected(h); setFocus([h.lat, h.lng]); }}
                    focus={focus}
                    minTemp={tempRange[0]}
                    maxTemp={tempRange[1]}
                  />
                </Suspense>
              )}
            </ClientOnly>
          </div>

          {/* Detail panel */}
          <div className="space-y-4">
            {selected ? <HotspotDetail hotspot={selected} onClose={() => setSelected(null)} /> : (
              <SectionCard title="Hotspot Details" subtitle="Click a cell or marker">
                <div className="flex flex-col items-center py-8 text-center text-xs text-muted-foreground">
                  <MapPin className="mb-2 h-8 w-8 opacity-30" />
                  No hotspot selected.
                </div>
              </SectionCard>
            )}

            <SectionCard title="Search Results" subtitle={`${results.length} matches`} action={<FilterIcon className="h-3.5 w-3.5 text-muted-foreground" />}>
              <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
                {results.map(h => (
                  <button
                    key={h.id}
                    onClick={() => { setSelected(h); setFocus([h.lat, h.lng]); }}
                    className="flex w-full items-center gap-2 rounded-md border border-transparent p-2 text-left transition-colors hover:border-border hover:bg-muted/50"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: heatHex(h.category) }} />
                    <span className="min-w-0 flex-1 truncate text-xs">{h.name}</span>
                    <span className="text-xs font-medium tabular-nums" style={{ color: heatHex(h.category) }}>
                      {h.lst.toFixed(1)}°
                    </span>
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function HotspotDetail({ hotspot, onClose }: { hotspot: Hotspot; onClose: () => void }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" style={{ color: heatHex(hotspot.category) }} />
            <h3 className="text-sm font-semibold tracking-tight">{hotspot.name}</h3>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground tabular-nums">
            {hotspot.lat.toFixed(4)}, {hotspot.lng.toFixed(4)}
          </div>
        </div>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
        <Stat label="Predicted LST" value={`${hotspot.lst.toFixed(1)}°C`} accent={heatHex(hotspot.category)} />
        <Stat label="Heat Category" value={hotspot.category} capitalize />
        <Stat label="Risk Level" value={hotspot.risk} capitalize />
        <Stat label="Confidence" value={`${(hotspot.confidence * 100).toFixed(0)}%`} />
        <Stat label="NDVI" value={hotspot.ndvi.toFixed(2)} />
        <Stat label="NDBI" value={hotspot.ndbi.toFixed(2)} />
      </div>

      <div className="mb-4">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Top Contributing Features</div>
        <div className="space-y-1.5">
          {hotspot.featureContributions.slice(0, 4).map(f => (
            <div key={f.feature} className="text-xs">
              <div className="mb-0.5 flex justify-between">
                <span>{f.feature}</span>
                <span className={f.value > 0 ? "text-orange-400" : "text-emerald-400"}>
                  {f.value > 0 ? "+" : ""}{f.value.toFixed(2)}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, Math.abs(f.value) * 100)}%`,
                    background: f.value > 0 ? "var(--heat-5)" : "var(--heat-2)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recommended Interventions</div>
        <ul className="space-y-1.5 text-xs">
          {hotspot.recommendations.map(r => (
            <li key={r} className="flex items-start gap-2 rounded-md border border-border/60 bg-muted/30 p-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, capitalize }: { label: string; value: string; accent?: string; capitalize?: boolean }) {
  return (
    <div className="rounded-md border border-border/60 bg-muted/30 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={"mt-0.5 text-sm font-semibold " + (capitalize ? "capitalize" : "")}
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
    </div>
  );
}