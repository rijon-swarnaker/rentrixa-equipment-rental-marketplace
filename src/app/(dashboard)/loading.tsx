
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function DashboardLoading() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">

        {/* Sidebar Skeleton */}
        <aside className="hidden w-64 shrink-0 border-r bg-background p-4 md:block">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3 px-2">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-6 w-28" />
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg px-3 py-3"
              >
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton
                  className="h-4 rounded-md"
                  style={{ width: `${65 + (index % 3) * 10}%` }}
                />
              </div>
            ))}
          </div>

          {/* Bottom Profile */}
          <div className="mt-auto border-t pt-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <SidebarInset className="min-w-0 flex-1">

          {/* Header Skeleton */}
          <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-4 w-px" />
            <Skeleton className="h-5 w-24" />

            <div className="ml-auto">
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </header>

          {/* Dashboard Content Skeleton */}
          <main className="flex-1 space-y-6 p-4 md:p-6">

            {/* Page Heading */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl border bg-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                  </div>
                  <Skeleton className="mt-5 h-8 w-28" />
                  <Skeleton className="mt-3 h-3 w-32" />
                </div>
              ))}
            </div>

            {/* Main Section */}
            <div className="grid gap-6 xl:grid-cols-3">

              {/* Chart */}
              <div className="rounded-xl border bg-card p-5 xl:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-9 w-24 rounded-md" />
                </div>

                <div className="flex h-64 items-end gap-3">
                  {[45, 70, 55, 85, 60, 95, 65, 80, 50, 75, 90, 60].map(
                    (height, index) => (
                      <Skeleton
                        key={index}
                        className="flex-1 rounded-t-md"
                        style={{ height: `${height}%` }}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Side Card */}
              <div className="space-y-4 rounded-xl border bg-card p-5">
                <Skeleton className="h-5 w-32" />
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="rounded-xl border bg-card p-5">
              <div className="mb-6 flex items-center justify-between">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>

              <div className="space-y-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4"
                  >
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-4 flex-1 max-w-40" />
                    <Skeleton className="hidden h-4 w-24 sm:block" />
                    <Skeleton className="hidden h-4 w-20 md:block" />
                    <Skeleton className="h-7 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
