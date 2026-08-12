export function HeatLegend() {
  const steps = [
    { label: "Cool", range: "<28°C", color: "var(--heat-1)" },
    { label: "Mild", range: "28-33°C", color: "var(--heat-2)" },
    { label: "Warm", range: "33-38°C", color: "var(--heat-3)" },
    { label: "Hot", range: "38-43°C", color: "var(--heat-4)" },
    { label: "Extreme", range: ">43°C", color: "var(--heat-5)" },
  ];
  return (
    <div className="glass rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Heat Legend</div>
        <div className="text-[10px] text-muted-foreground">Predicted LST</div>
      </div>
      <div className="heat-gradient mb-3 h-2 w-full rounded-full" />
      <div className="grid grid-cols-5 gap-1 text-[10px]">
        {steps.map((s) => (
          <div key={s.label} className="flex flex-col items-start gap-0.5">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
              <span className="font-medium">{s.label}</span>
            </div>
            <span className="text-muted-foreground">{s.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}