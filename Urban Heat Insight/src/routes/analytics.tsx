import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
  CartesianGrid, Cell, ScatterChart, Scatter, ZAxis, LineChart, Line, Legend,
} from "recharts";
import { ArrowUpDown } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NDVI_LST_SCATTER, heatHex, type Hotspot
} from "@/lib/mock-data";
import { fetchStatistics, fetchHotspots, fetchFeatureImportance } from "@/lib/api";
import { useEffect } from "react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Hotspot Analytics · HeatSatAI" },
      { name: "description", content: "Top hotspots ranking, feature importance, temperature histogram and NDVI–LST scatter analytics." },
    ],
  }),
  component: Analytics,
});

type SortKey = "lst" | "ndvi" | "population" | "name";

function Analytics() {
  const [sort, setSort] = useState<SortKey>("lst");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [featureImportance, setFeatureImportance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchHotspots(), fetchStatistics(), fetchFeatureImportance()]).then(([hots, st, fi]) => {
      setHotspots(hots);
      setStats(st);
      setFeatureImportance(fi);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading || !stats) return <AppLayout><div className="flex h-full items-center justify-center pt-20 text-muted-foreground">Loading analytics...</div></AppLayout>;

  const top = [...hotspots.slice(0, 20)].sort((a, b) => {
    const va = a[sort]; const vb = b[sort];
    const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
    return dir === "asc" ? cmp : -cmp;
  });

  const toggle = (key: SortKey) => {
    if (sort === key) setDir(d => d === "asc" ? "desc" : "asc");
    else { setSort(key); setDir("desc"); }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Hotspot Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rank, compare and explore heat hotspots across the study area.
          </p>
        </div>

        <SectionCard
          title="Top 20 Hottest Regions"
          subtitle="Sortable · click any header"
          action={<Badge variant="outline" className="text-[10px]">{hotspots.length} total hotspots</Badge>}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2 pr-4">#</th>
                  <SortHeader label="Location" active={sort === "name"} dir={dir} onClick={() => toggle("name")} />
                  <SortHeader label="LST" active={sort === "lst"} dir={dir} onClick={() => toggle("lst")} align="right" />
                  <SortHeader label="NDVI" active={sort === "ndvi"} dir={dir} onClick={() => toggle("ndvi")} align="right" />
                  <th className="pb-2 pr-4 text-right">NDBI</th>
                  <SortHeader label="Population" active={sort === "population"} dir={dir} onClick={() => toggle("population")} align="right" />
                  <th className="pb-2 pr-4">Land Cover</th>
                  <th className="pb-2 pr-4">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {top.map((h, i) => (
                  <tr key={h.id} className="transition-colors hover:bg-muted/30">
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground tabular-nums">{i + 1}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: heatHex(h.category) }} />
                        <span className="font-medium">{h.name}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground tabular-nums">{h.lat.toFixed(3)}, {h.lng.toFixed(3)}</div>
                    </td>
                    <td className="py-2.5 pr-4 text-right font-semibold tabular-nums" style={{ color: heatHex(h.category) }}>
                      {h.lst.toFixed(1)}°C
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{h.ndvi.toFixed(2)}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{h.ndbi.toFixed(2)}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums text-muted-foreground">{h.population.toLocaleString()}</td>
                    <td className="py-2.5 pr-4 text-xs capitalize text-muted-foreground">{h.landCover}</td>
                    <td className="py-2.5 pr-4">
                      <RiskBadge risk={h.risk} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Global Feature Importance" subtitle="Mean |SHAP| across all predictions">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportance} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis dataKey="feature" type="category" stroke="rgba(255,255,255,0.5)" fontSize={11} width={140} tickLine={false} axisLine={false} />
                  <RTooltip contentStyle={{ background: "rgba(20,25,40,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="importance" radius={[0, 6, 6, 0]} fill="url(#brandGrad)" />
                  <defs>
                    <linearGradient id="brandGrad" x1="0" x2="1">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Temperature Histogram" subtitle="Bin count by LST bucket">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.temp_distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="bucket" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} />
                  <RTooltip contentStyle={{ background: "rgba(20,25,40,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {stats.temp_distribution.map((d: any, i: number) => <Cell key={i} fill={heatHex(d.category)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="NDVI vs LST" subtitle="Vegetation index inversely correlates with heat">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" dataKey="ndvi" name="NDVI" stroke="rgba(255,255,255,0.5)" fontSize={11} domain={[0, 0.7]} />
                  <YAxis type="number" dataKey="lst" name="LST" unit="°C" stroke="rgba(255,255,255,0.5)" fontSize={11} domain={[24, 50]} />
                  <ZAxis range={[60, 60]} />
                  <RTooltip
                    contentStyle={{ background: "rgba(20,25,40,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                    cursor={{ strokeDasharray: "3 3" }}
                  />
                  <Scatter data={NDVI_LST_SCATTER}>
                    {NDVI_LST_SCATTER.map((d, i) => <Cell key={i} fill={heatHex(d.category)} />)}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Heat Trend (12 mo)" subtitle="Monthly avg vs max LST">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.heat_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} unit="°" tickLine={false} axisLine={false} />
                  <RTooltip contentStyle={{ background: "rgba(20,25,40,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="avg" stroke="#60a5fa" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="max" stroke="#f97316" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Distribution by Land Cover" subtitle="Share of study area by class">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {stats.land_cover_dist.map((lc: any) => (
              <div key={lc.name} className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: lc.color }} />
                  <span className="text-xs font-medium">{lc.name}</span>
                </div>
                <div className="text-xl font-semibold tabular-nums">{lc.value}%</div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${lc.value * 2}%`, background: lc.color }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppLayout>
  );
}

function SortHeader({ label, active, dir, onClick, align }: { label: string; active: boolean; dir: "asc" | "desc"; onClick: () => void; align?: "right" }) {
  return (
    <th className={"pb-2 pr-4 " + (align === "right" ? "text-right" : "")}>
      <Button variant="ghost" size="sm" className="h-auto gap-1 px-1 text-[11px] uppercase tracking-wider" onClick={onClick}>
        {label}
        <ArrowUpDown className={"h-3 w-3 " + (active ? "text-primary" : "text-muted-foreground/50")} />
      </Button>
    </th>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, string> = {
    low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    moderate: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    high: "border-orange-500/30 bg-orange-500/10 text-orange-400",
    critical: "border-red-500/30 bg-red-500/10 text-red-400",
  };
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${map[risk]}`}>{risk}</span>;
}