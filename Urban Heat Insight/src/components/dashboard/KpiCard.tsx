import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon: LucideIcon;
  accent?: string;
}

export function KpiCard({ label, value, unit, delta, trend = "flat", icon: Icon, accent = "var(--primary)" }: KpiCardProps) {
  return (
    <div className="glass group relative overflow-hidden rounded-xl p-5 transition-shadow hover:shadow-[var(--shadow-elegant)]">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-30"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60"
          style={{ background: `color-mix(in oklab, ${accent} 12%, transparent)` }}
        >
          <Icon className="h-4 w-4" style={{ color: accent }} />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <div className="text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
        {unit && <div className="text-sm text-muted-foreground">{unit}</div>}
      </div>
      {delta && (
        <div className={cn(
          "mt-1 text-xs font-medium",
          trend === "up" && "text-orange-400",
          trend === "down" && "text-emerald-400",
          trend === "flat" && "text-muted-foreground",
        )}>
          {delta}
        </div>
      )}
    </div>
  );
}