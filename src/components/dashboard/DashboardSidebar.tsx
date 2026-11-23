"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarCheck,
  Heart,
  ClipboardList,
  LogOut,
  Package,
  PlusCircle,
  UserRound,
  Users,
  ChevronUp,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { signOut } from "@/lib/auth-client";
import type { TUserRole } from "@/types";

type DashboardUser = {
  name: string;
  email: string;
  image?: string | null;
  role: TUserRole;
};

// Role-based sidebar configuration
export const roleBasedSidebarItems = {
  customer: [
    {
      title: "My Rentals",
      href: "/dashboard/customer/my-rentals",
      icon: CalendarCheck,
    },
    {
      title: "Favorites",
      href: "/dashboard/customer/favorites",
      icon: Heart,
    },
    {
      title: "Profile",
      href: "/dashboard/customer/profile",
      icon: UserRound,
    },
  ],

  owner: [
    {
      title: "Add Equipment",
      href: "/dashboard/owner/add-equipment",
      icon: PlusCircle,
    },
    {
      title: "My Equipment",
      href: "/dashboard/owner/my-equipment",
      icon: Package,
    },
    {
      title: "My Equipment Rental",
      href: "/dashboard/owner/rentals",
      icon: ClipboardList,
    },
    {
      title: "My Profile",
      href: "/dashboard/owner/profile",
      icon: UserRound,
    },
  ],

  admin: [
    {
      title: "All Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "All Equipment",
      href: "/dashboard/admin/equipment",
      icon: Package,
    },
    {
      title: "All Rentals",
      href: "/dashboard/admin/rentals",
      icon: ClipboardList,
    },
    {
      title: "My Profile",
      href: "/dashboard/admin/profile",
      icon: UserRound,
    },
  ],
} satisfies Record<
  TUserRole,
  {
    title: string;
    href: string;
    icon: React.ElementType;
  }[]
>;

type DashboardSidebarProps = {
  user: DashboardUser | null;
};

const activeItemClasses =
  "data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold";

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { isMobile, setOpenMobile } = useSidebar();

  // Get logged-in user's role
  const role = user?.role || "user"; // Default role
  const sidebarItems = roleBasedSidebarItems[role as TUserRole] || [];

  // Active route checker
  const isActive = React.useCallback(
    (href: string) => {
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  // Close mobile sidebar after navigation
  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <Sidebar collapsible="icon">
      {/* Brand */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Rentrixa"
              render={<Link href="/" onClick={handleNavigate} />}
              className="hover:bg-transparent active:bg-transparent"
            >
              <Image
                src="/assets/Logo.png"
                alt="Rentrixa"
                width={2172}
                height={724}
                priority
                className="h-15 w-auto group-data-[collapsible=icon]:hidden dark:brightness-0 dark:invert"
              />

              <span className="hidden size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground group-data-[collapsible=icon]:flex">
                R
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role === "customer"
              ? "Customer Menu"
              : role === "owner"
                ? "Owner Menu"
                : role === "admin"
                  ? "Admin Menu"
                  : "Dashboard"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive(item.href)}
                      render={
                        <Link href={item.href} onClick={handleNavigate} />
                      }
                      className={activeItemClasses}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          {/* Back to Home */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Back to Home"
              render={<Link href="/" onClick={handleNavigate} />}
            >
              <ArrowLeft />
              <span>Back to Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* User Account */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={user?.name ?? "Account"}
                  />
                }
              >
                <Avatar className="size-8">
                  <AvatarImage
                    src={user?.image ?? undefined}
                    alt={user?.name ?? "User"}
                  />

                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase() ?? "R"}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-semibold">
                    {user?.name ?? "Guest"}
                  </span>

                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {user?.email ?? "Not signed in"}
                  </span>
                </div>

                <ChevronUp className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="end"
                sideOffset={8}
                className="w-56"
              >
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
