import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Map, BarChart3, Sparkles, Brain, Info, Flame,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const nav = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Heat Map", url: "/heat-map", icon: Map },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Recommendations", url: "/recommendations", icon: Sparkles },
  { title: "Explainability", url: "/explainability", icon: Brain },
  { title: "About", url: "/about", icon: Info },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="brand-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-[0_0_20px_rgba(96,165,250,0.3)]">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-tight">HeatSatAI</div>
              <div className="truncate text-[10px] text-muted-foreground">Urban Heat DSS</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Model Status</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="mx-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3 text-xs">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-semibold text-foreground">92.3%</span>
                </div>
                <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="brand-gradient h-full" style={{ width: "92.3%" }} />
                </div>
                <div className="text-[10px] text-muted-foreground">
                  XGBoost + SHAP · v1.4.2
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}