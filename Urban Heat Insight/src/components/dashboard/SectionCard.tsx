import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title, subtitle, action, children, className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("glass rounded-xl p-5", className)}>
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}