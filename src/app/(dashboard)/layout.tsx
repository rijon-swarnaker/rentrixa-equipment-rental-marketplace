import React from "react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";


import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

type DashBoardLayoutProps = {
  children: React.ReactNode;
};

const DashBoardLayout = async ({ children }: DashBoardLayoutProps) => {
     const [cookieStore, session] = await Promise.all([
    cookies(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  const user = session
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
      }
    : null;

    

  return (
    <TooltipProvider>
      <SidebarProvider   defaultOpen={defaultOpen}>
        <DashboardSidebar  user ={user} />

        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger className="-ml-1" />
            <span aria-hidden="true" className="h-4 w-px bg-border" />
            <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>

            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashBoardLayout;
