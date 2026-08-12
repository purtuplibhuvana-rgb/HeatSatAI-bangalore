import { createFileRoute } from "@tanstack/react-router";
import { Thermometer, Flame, MapPin, Leaf, Snowflake, Target } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { AppLayout } from "@/components/AppLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { HeatLegend } from "@/components/dashboard/HeatLegend";
import { Badge } from "@/components/ui/badge";
import {
  heatHex, type Hotspot
} from "@/lib/mock-data";
import { fetchStatistics, fetchHotspots } from "@/lib/api";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · HeatSatAI" },
      { name: "description", content: "Overview dashboard with KPIs, temperature distributions and model summary for Bengaluru urban heat." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const [data, setData] = useState<any>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStatistics(), fetchHotspots()]).then(([stats, hots]) => {
      setData(stats);
      setHotspots(hots);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading || !data) return <AppLayout><div className="flex h-full items-center justify-center pt-20 text-muted-foreground">Loading overview...</div></AppLayout>;

  const { kpi, temp_distribution, land_cover_dist, heat_category_dist, heat_trend, model_meta } = data;

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Bengaluru</span>
            <span>·</span>
            <span>Last updated {model_meta.lastRun}</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Overview Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time urban heat intelligence — predicted land-surface temperature, hotspots and cooling potential.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Avg LST" value={kpi.avgLST.toFixed(1)} unit="°C" icon={Thermometer} accent="var(--heat-3)" delta="+0.6 vs last week" trend="up" />
          <KpiCard label="Max LST" value={kpi.maxLST.toFixed(1)} unit="°C" icon={Flame} accent="var(--heat-5)" delta="+1.4 vs last week" trend="up" />
          <KpiCard label="Hotspots" value={String(kpi.hotspotCount)} icon={MapPin} accent="var(--heat-4)" delta="12 new this week" trend="up" />
          <KpiCard label="Avg NDVI" value={kpi.avgNDVI.toFixed(2)} icon={Leaf} accent="var(--heat-2)" delta="-0.02 vs last week" trend="up" />
          <KpiCard label="Cooling Potential" value={kpi.coolingPotential.toFixed(1)} unit="°C" icon={Snowflake} accent="var(--brand-cyan)" delta="Across 128 sites" trend="flat" />
          <KpiCard label="Model Accuracy" value={(kpi.accuracy * 100).toFixed(1)} unit="%" icon={Target} accent="var(--primary)" delta="R² 0.923" trend="flat" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard
            title="Temperature Distribution"
            subtitle="Predicted LST buckets across Bengaluru grid"
            className="lg:col-span-2"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={temp_distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="bucket" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} />
                  <RTooltip contentStyle={{ background: "rgba(20,25,40,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {temp_distribution.map((d: any, i: number) => (
                      <Cell key={i} fill={heatHex(d.category)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <div className="space-y-4">
            <HeatLegend />
            <SectionCard title="Model Summary" subtitle={model_meta.algorithm}>
              <dl className="space-y-2 text-xs">
                {[
                  ["Version", model_meta.version],
                  ["Samples", model_meta.samples.toLocaleString()],
                  ["R² Score", model_meta.r2.toFixed(3)],
                  ["RMSE", `${model_meta.rmse} °C`],
                  ["MAE", `${model_meta.mae} °C`],
                  ["Datasets", model_meta.trainedOn],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-border/40 pb-1.5 last:border-0">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </SectionCard>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Land Cover Distribution" subtitle="% of study area by class">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={land_cover_dist} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {land_cover_dist.map((d: any, i: number) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <RTooltip contentStyle={{ background: "rgba(20,25,40,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Heat Category Distribution" subtitle="Cells by heat classification">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={heat_category_dist} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={11} width={70} tickLine={false} axisLine={false} />
                  <RTooltip contentStyle={{ background: "rgba(20,25,40,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {heat_category_dist.map((d: any, i: number) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Heat Trend" subtitle="12-month avg vs max predicted LST">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heat_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} unit="°" />
                <RTooltip contentStyle={{ background: "rgba(20,25,40,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="avg" stroke="#60a5fa" strokeWidth={2.5} dot={false} name="Avg LST" />
                <Line type="monotone" dataKey="max" stroke="#f97316" strokeWidth={2.5} dot={false} name="Max LST" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Top 5 Hottest Regions" action={<Badge variant="outline" className="text-[10px]">Predicted LST</Badge>}>
          <div className="divide-y divide-border/40">
            {hotspots.slice(0, 5).map((h, i) => (
              <div key={h.id} className="flex items-center gap-4 py-3">
                <div className="w-6 text-xs font-medium text-muted-foreground tabular-nums">#{i + 1}</div>
                <div
                  className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-2 ring-offset-background"
                  style={{ background: heatHex(h.category as any), boxShadow: `0 0 12px ${heatHex(h.category as any)}` }}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{h.name}</div>
                  <div className="text-[11px] capitalize text-muted-foreground">
                    {h.landCover} · {h.population.toLocaleString()} residents
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums" style={{ color: heatHex(h.category as any) }}>
                    {h.lst.toFixed(1)}°C
                  </div>
                  <div className="text-[11px] capitalize text-muted-foreground">{h.risk} risk</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppLayout>
  );
}