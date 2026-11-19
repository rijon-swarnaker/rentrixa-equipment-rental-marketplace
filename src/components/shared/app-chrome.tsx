"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import FooTerPage from "@/components/shared/FooTer";
import { NavBerPage } from "@/components/shared/NavBer";

// The dashboard has its own full-height sidebar shell, so the marketing
// navbar and footer are hidden on /dashboard routes.
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isDashboard) {
    return (
      <div className="flex min-h-svh w-full flex-col">{children}</div>
    );
  }

  return (
    <>
      <NavBerPage />
      <main>{children}</main>
      <FooTerPage />
    </>
  );
}
