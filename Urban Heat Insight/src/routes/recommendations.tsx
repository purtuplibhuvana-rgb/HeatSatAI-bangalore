import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, TrendingDown, DollarSign, Wrench, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { heatHex, type Recommendation, type Hotspot } from "@/lib/mock-data";
import { fetchRecommendations, fetchHotspots } from "@/lib/api";
import { useEffect } from "react";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "AI Recommendations · HeatSatAI" },
      { name: "description", content: "AI-generated cooling interventions with estimated temperature reduction, cost, priority and implementation difficulty." },
    ],
  }),
  component: Recommendations,
});

function Recommendations() {
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load hotspots and set initial selection
    fetchHotspots()
      .then((hots) => {
        setHotspots(hots);
        if (hots.length > 0) setSelected(hots[0]);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Load recommendations for the selected hotspot
    if (!selected) return;
    setLoading(true);
    fetchRecommendations(selected.id)
      .then((recs) => setRecommendations(recs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selected]);

  if (loading || !selected) return <AppLayout><div className="flex h-full items-center justify-center pt-20 text-muted-foreground">Loading recommendations...</div></AppLayout>;

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Recommendations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Targeted cooling interventions ranked by impact, cost and implementation difficulty.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <SectionCard title="Hotspots" subtitle="Select to view interventions">
            <div className="max-h-[560px] space-y-1 overflow-y-auto pr-1">
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
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: heatHex(h.category) }} />
                      <span className="truncate text-sm font-medium">{h.name}</span>
                    </div>
                    <span className="text-xs font-semibold tabular-nums" style={{ color: heatHex(h.category) }}>
                      {h.lst.toFixed(1)}°
                    </span>
                  </div>
                  <div className="mt-0.5 text-[10px] capitalize text-muted-foreground">
                    {h.landCover} · {h.risk} risk
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>

          <div className="space-y-4">
            <div className="glass rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Selected Hotspot</div>
                  <div className="mt-1 flex items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight">{selected.name}</h2>
                    <Badge variant="outline" className="capitalize">{selected.risk}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground tabular-nums">
                    {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)} · {selected.landCover}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold tabular-nums" style={{ color: heatHex(selected.category) }}>
                    {selected.lst.toFixed(1)}°C
                  </div>
                  <div className="text-[11px] text-muted-foreground">Predicted LST</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border/40 pt-4 text-xs">
                <div>
                  <div className="text-muted-foreground">Total cooling potential</div>
                  <div className="mt-1 text-lg font-semibold text-emerald-400">−{recommendations.reduce((s, r) => s + r.impact, 0).toFixed(1)}°C</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Interventions</div>
                  <div className="mt-1 text-lg font-semibold">{recommendations.length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Est. after mitigation</div>
                  <div className="mt-1 text-lg font-semibold text-primary">
                    {(selected.lst - 4.6).toFixed(1)}°C
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map(r => <RecommendationCard key={r.id} rec={r} />)}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const priorityMap: Record<string, string> = {
    low: "border-slate-500/30 bg-slate-500/10 text-slate-300",
    medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    high: "border-orange-500/30 bg-orange-500/10 text-orange-400",
    critical: "border-red-500/30 bg-red-500/10 text-red-400",
  };

  return (
    <div className="glass group flex flex-col rounded-xl p-5 transition-shadow hover:shadow-[var(--shadow-elegant)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="brand-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">{rec.title}</h3>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{rec.category}</div>
          </div>
        </div>
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${priorityMap[rec.priority]}`}>
          {rec.priority}
        </span>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{rec.description}</p>

      <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
        <MetricPill icon={TrendingDown} label="Impact" value={`−${rec.impact}°C`} accent="var(--heat-2)" />
        <MetricPill icon={DollarSign} label="Cost" value={rec.cost} accent="var(--heat-3)" capitalize />
        <MetricPill icon={Wrench} label="Effort" value={rec.difficulty} accent="var(--brand-cyan)" capitalize />
      </div>

      <Button variant="ghost" size="sm" className="mt-auto justify-between text-xs">
        View implementation guide
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function MetricPill({ icon: Icon, label, value, accent, capitalize }: { icon: React.ElementType; label: string; value: string; accent: string; capitalize?: boolean }) {
  return (
    <div className="rounded-md border border-border/60 bg-muted/30 p-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" style={{ color: accent }} />
        {label}
      </div>
      <div className={"mt-0.5 text-sm font-semibold " + (capitalize ? "capitalize" : "")} style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}