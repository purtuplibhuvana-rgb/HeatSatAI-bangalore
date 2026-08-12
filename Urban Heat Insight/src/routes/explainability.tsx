import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, ArrowUp, ArrowDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
  CartesianGrid, Cell,
} from "recharts";
import { AppLayout } from "@/components/AppLayout";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Badge } from "@/components/ui/badge";
import { heatHex, type Hotspot } from "@/lib/mock-data";
import { fetchFeatureImportance, fetchHotspots } from "@/lib/api";
import { useEffect } from "react";

export const Route = createFileRoute("/explainability")({
  head: () => ({
    meta: [
      { title: "Model Explainability · HeatSatAI" },
      { name: "description", content: "SHAP-based global and local explainability for the urban heat prediction model." },
    ],
  }),
  component: Explainability,
});

function Explainability() {
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [featureImportance, setFeatureImportance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchHotspots(), fetchFeatureImportance()]).then(([hots, fi]) => {
      setHotspots(hots);
      setFeatureImportance(fi);
      if (hots.length > 0) setSelected(hots[0]);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading || !selected) return <AppLayout><div className="flex h-full items-center justify-center pt-20 text-muted-foreground">Loading explainability...</div></AppLayout>;

  const positive = selected.featureContributions.filter(f => f.value > 0);
  const negative = selected.featureContributions.filter(f => f.value < 0);
  const baseValue = 32.4;

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex items-center gap-3">
          <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-lg">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Model Explainability</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              SHAP-based interpretation of every prediction · global patterns and per-hotspot drivers.
            </p>
          </div>
        </div>

        <SectionCard
          title="Global Feature Importance"
          subtitle="Mean absolute SHAP value across all predictions"
          action={<Badge variant="outline" className="text-[10px]">XGBoost + SHAP</Badge>}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportance} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis dataKey="feature" type="category" stroke="rgba(255,255,255,0.5)" fontSize={11} width={150} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={{ background: "rgba(20,25,40,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                  {featureImportance.map((_, i) => (
                    <Cell key={i} fill={`hsl(${210 - i * 12}, 80%, 60%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <SectionCard title="Select Hotspot" subtitle="Local SHAP explanation">
            <div className="max-h-[520px] space-y-1 overflow-y-auto pr-1">
              {hotspots.slice(0, 20).map(h => (
                <button
                  key={h.id}
                  onClick={() => setSelected(h)}
                  className={`w-full rounded-md border p-2.5 text-left transition-colors ${
                    selected.id === h.id
                      ? "border-primary/40 bg-primary/10"
                      : "border-transparent hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-medium">{h.name}</span>
                    <span className="text-xs font-semibold tabular-nums" style={{ color: heatHex(h.category) }}>
                      {h.lst.toFixed(1)}°
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>

          <div className="space-y-4">
            <SectionCard
              title={`Why is ${selected.name} hot?`}
              subtitle={`Predicted ${selected.lst.toFixed(1)}°C vs baseline ${baseValue.toFixed(1)}°C`}
            >
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 text-xs">
                <div className="flex-1">
                  <div className="text-muted-foreground">Baseline (avg city LST)</div>
                  <div className="mt-0.5 text-lg font-semibold tabular-nums">{baseValue.toFixed(1)}°C</div>
                </div>
                <ArrowUp className="h-4 w-4 text-orange-400" />
                <div className="flex-1">
                  <div className="text-muted-foreground">Prediction</div>
                  <div className="mt-0.5 text-lg font-semibold tabular-nums" style={{ color: heatHex(selected.category) }}>
                    {selected.lst.toFixed(1)}°C
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-muted-foreground">Delta</div>
                  <div className="mt-0.5 text-lg font-semibold text-orange-400 tabular-nums">
                    +{(selected.lst - baseValue).toFixed(1)}°C
                  </div>
                </div>
              </div>

              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Top 5 contributing features</div>
              <div className="space-y-2.5">
                {selected.featureContributions.slice(0, 5).map(f => (
                  <ContributionBar key={f.feature} feature={f.feature} value={f.value} />
                ))}
              </div>
            </SectionCard>

            <div className="grid gap-4 md:grid-cols-2">
              <SectionCard title="Warming Contributors" subtitle="Features pushing LST up" action={<ArrowUp className="h-4 w-4 text-orange-400" />}>
                <div className="space-y-1.5">
                  {positive.map(f => (
                    <div key={f.feature} className="flex items-center justify-between rounded-md border border-orange-500/20 bg-orange-500/5 p-2 text-xs">
                      <span>{f.feature}</span>
                      <span className="font-semibold text-orange-400 tabular-nums">+{f.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Cooling Contributors" subtitle="Features pulling LST down" action={<ArrowDown className="h-4 w-4 text-emerald-400" />}>
                <div className="space-y-1.5">
                  {negative.map(f => (
                    <div key={f.feature} className="flex items-center justify-between rounded-md border border-emerald-500/20 bg-emerald-500/5 p-2 text-xs">
                      <span>{f.feature}</span>
                      <span className="font-semibold text-emerald-400 tabular-nums">{f.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ContributionBar({ feature, value }: { feature: string; value: number }) {
  const width = Math.min(100, Math.abs(value) * 100);
  const positive = value > 0;
  return (
    <div className="text-xs">
      <div className="mb-1 flex justify-between">
        <span>{feature}</span>
        <span className={"font-semibold tabular-nums " + (positive ? "text-orange-400" : "text-emerald-400")}>
          {positive ? "+" : ""}{value.toFixed(2)}
        </span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-muted/40">
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            width: `${width}%`,
            [positive ? "left" : "right"]: "50%",
            background: positive ? "var(--heat-5)" : "var(--heat-2)",
          } as React.CSSProperties}
        />
        <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
      </div>
    </div>
  );
}