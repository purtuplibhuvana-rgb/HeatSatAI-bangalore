import { Bell, Download, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="hidden md:block">
        <div className="text-sm font-semibold tracking-tight">HeatSatAI</div>
        <div className="text-[10px] text-muted-foreground">AI-Powered Urban Heat Mitigation DSS</div>
      </div>

      <div className="ml-4 hidden max-w-md flex-1 md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search neighborhoods, hotspots, features..."
            className="h-9 border-border/60 bg-muted/40 pl-9 text-sm focus-visible:ring-primary/40"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Badge variant="outline" className="hidden gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 sm:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live · Bengaluru
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Export data</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>CSV</DropdownMenuItem>
            <DropdownMenuItem>PNG</DropdownMenuItem>
            <DropdownMenuItem>PDF Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-400" />
        </Button>
      </div>
    </header>
  );
}