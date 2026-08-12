import { createFileRoute } from "@tanstack/react-router";
import { Satellite, Database, Cpu, LineChart, Rocket, Github, Target, Layers } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Badge } from "@/components/ui/badge";
import { MODEL_META } from "@/lib/mock-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · HeatSatAI" },
      { name: "description", content: "About the HeatSatAI project — problem statement, methodology, datasets, ML pipeline and technology stack." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="glass rounded-2xl p-8">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
            <Rocket className="mr-1 h-3 w-3" /> ISRO Bharatiya Antariksh Hackathon
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">HeatSatAI</h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            AI-Powered Urban Heat Mitigation Decision Support System
          </p>
          <div className="mt-6 heat-gradient h-1 w-full rounded-full" />
        </div>

        <SectionCard title="Project Overview" subtitle="What we're building">
          <p className="text-sm leading-relaxed text-muted-foreground">
            HeatSatAI helps urban planners identify heat hotspots, understand
            <em> why</em> those hotspots occur, and select the most effective
            cooling interventions. It fuses multi-source satellite data with a
            machine learning model to predict Land Surface Temperature (LST) at
            fine spatial resolution and expose the reasoning behind every
            prediction through SHAP explainability.
          </p>
        </SectionCard>

        <SectionCard title="Problem Statement" subtitle="Why urban heat matters">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Indian cities like Bengaluru face rapidly intensifying urban heat
            islands (UHI) driven by dense construction, vanishing tree canopy
            and shrinking water bodies. Existing dashboards show
            <em> what</em> is hot but not <em>why</em>, and rarely translate
            that intelligence into concrete, prioritized interventions. Urban
            planners need a tool that connects satellite observations to
            actionable cooling strategies.
          </p>
        </SectionCard>

        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="Methodology" subtitle="From pixels to policy">
            <ol className="space-y-3 text-sm text-muted-foreground">
              {[
                "Ingest multi-source satellite imagery over the study area",
                "Compute vegetation, built-up and albedo indices per grid cell",
                "Predict LST with a gradient-boosted regressor",
                "Explain each prediction with local SHAP values",
                "Match every hotspot to a ranked intervention playbook",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="brand-gradient flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard title="Satellite Datasets" subtitle="Inputs">
            <ul className="space-y-2 text-sm">
              {[
                { name: "Landsat 8/9", desc: "Thermal & multispectral · 30 m" },
                { name: "Sentinel-2", desc: "Optical bands for NDVI/NDBI · 10 m" },
                { name: "MODIS LST", desc: "Daily surface temperature · 1 km" },
                { name: "WorldPop", desc: "Population density · 100 m" },
                { name: "OSM Landuse", desc: "Auxiliary land-cover labels" },
              ].map(d => (
                <li key={d.name} className="flex items-start gap-2 rounded-md border border-border/60 bg-muted/30 p-2.5">
                  <Satellite className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <div>
                    <div className="text-xs font-medium">{d.name}</div>
                    <div className="text-[11px] text-muted-foreground">{d.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <SectionCard title="Machine Learning Pipeline" subtitle={MODEL_META.algorithm}>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              { icon: Database, label: "Data Ingestion", desc: "Google Earth Engine, GEE STAC" },
              { icon: Layers, label: "Feature Engineering", desc: "NDVI, NDBI, albedo, impervious %" },
              { icon: Cpu, label: "Model Training", desc: "XGBoost regressor, k-fold CV" },
              { icon: Target, label: "Inference & SHAP", desc: "Per-cell prediction + explanation" },
            ].map(step => (
              <div key={step.label} className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="brand-gradient mb-2 flex h-8 w-8 items-center justify-center rounded-md">
                  <step.icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="text-xs font-semibold">{step.label}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{step.desc}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Model Performance" subtitle="Hold-out test set">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <PerfCard label="R² Score" value={MODEL_META.r2.toFixed(3)} accent="var(--primary)" />
            <PerfCard label="RMSE" value={`${MODEL_META.rmse} °C`} accent="var(--heat-3)" />
            <PerfCard label="MAE" value={`${MODEL_META.mae} °C`} accent="var(--heat-2)" />
            <PerfCard label="Samples" value={MODEL_META.samples.toLocaleString()} accent="var(--brand-cyan)" />
          </div>
        </SectionCard>

        <SectionCard title="Technology Stack">
          <div className="flex flex-wrap gap-2">
            {[
              "React 19", "TypeScript", "TanStack Start", "Tailwind CSS v4",
              "Recharts", "Leaflet", "Python", "XGBoost", "SHAP",
              "Google Earth Engine", "FastAPI",
            ].map(t => (
              <span key={t} className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs">
                {t}
              </span>
            ))}
          </div>
        </SectionCard>

        <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <LineChart className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm font-semibold">Built for ISRO Bharatiya Antariksh Hackathon</div>
              <div className="text-xs text-muted-foreground">Bengaluru pilot · designed for national rollout</div>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            <Github className="h-3.5 w-3.5" /> View source
          </a>
        </div>
      </div>
    </AppLayout>
  );
}

function PerfCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums" style={{ color: accent }}>{value}</div>
    </div>
  );
}