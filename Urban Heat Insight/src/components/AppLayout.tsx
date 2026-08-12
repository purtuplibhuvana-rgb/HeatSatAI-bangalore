import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./layout/AppSidebar";
import { TopBar } from "./layout/TopBar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}