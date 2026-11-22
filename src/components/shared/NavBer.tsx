
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  User,
  Users,
  X,
} from "lucide-react";

import { Dialog } from "@base-ui/react/dialog";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

// Navigation links
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/all-equipment" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "How It Works", href: "/how-it-works" },
];

// Desktop navigation styles
const desktopLinkClasses =
  "relative inline-flex h-10 items-center gap-1 rounded-lg px-3 text-sm font-medium outline-none transition-all duration-300 hover:bg-muted hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50";

// Mobile navigation styles
const mobileLinkClasses =
  "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70 outline-none transition-all duration-200 hover:bg-primary/10 hover:text-primary";

// Logo
function Logo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center"
      aria-label="Rentrixa home"
    >
      <Image
        src="/assets/Logo.png"
        alt="Rentrixa"
        width={2172}
        height={724}
        priority
        className="h-9 w-auto transition-all duration-300 sm:h-10 dark:brightness-0 dark:invert"
      />
    </Link>
  );
}

// Mobile logo
function LogoMark() {
  return (
    <Image
      src="/assets/Logo.png"
      alt="Rentrixa"
      width={2172}
      height={724}
      priority
      className="h-8 w-auto transition-all duration-300 dark:brightness-0 dark:invert"
    />
  );
}

// Desktop navigation
function DesktopNavLinks() {
  const pathname = usePathname();

  return (
    <ul className="hidden items-center gap-0.5 lg:flex">
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                desktopLinkClasses,
                isActive ? "text-primary" : "text-foreground/70",
              )}
            >
              {link.label}

              {isActive && (
                <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// Authentication links
function AuthButtons({ className }: { className?: string }) {
  const { data: session, isPending } = useSession();

  // Loading State
  if (isPending) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        <div className="h-10 w-24 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  const isLoggedIn = !!session?.user;

  if (isLoggedIn) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Avatar>
          <AvatarImage src={session.user.image as string} />
          <AvatarFallback>
            {session.user.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-black transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary dark:text-white"
        >
          <LayoutDashboard className="size-4 text-primary" />
          Dashboard
        </Link>

        <button
          type="button"
          aria-label="Sign out"
          title="Sign out"
          onClick={() => signOut()}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link
        href="/login"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-input bg-background px-4 text-sm font-medium text-black transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary dark:text-white"
      >
        <User className="size-4 text-primary" />
        Login
      </Link>

      <Link
        href="/register"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90"
      >
        <Users className="size-4" />
        Register
      </Link>
    </div>
  );
}

// Mobile navigation
function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close drawer when route changes
  const [prevPathname, setPrevPathname] =
    React.useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Menu Trigger */}
      <Dialog.Trigger
        className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-black transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring dark:text-white lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon className="size-5" />
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 outline-none backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />

        {/* Mobile Drawer */}
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-l border-border bg-nav p-5 shadow-2xl outline-none transition-transform duration-200 ease-out data-ending-style:translate-x-full data-starting-style:translate-x-full">
          <Dialog.Title className="sr-only">
            Navigation menu
          </Dialog.Title>

          {/* Close Button */}
          <Dialog.Close
            className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </Dialog.Close>

          {/* Logo */}
          <Link
            href="/"
            aria-label="Rentrixa home"
            onClick={() => setOpen(false)}
          >
            <LogoMark />
          </Link>

          {/* Navigation Links */}
          <nav className="mt-8 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    mobileLinkClasses,
                    isActive && "bg-primary/10 text-primary",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Account & Appearance */}
          <div className="mt-auto flex flex-col gap-4 pt-8">
            <div className="flex flex-col gap-2">
              <p className="px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Account
              </p>

              <AuthButtons className="w-full [&>*]:flex-1" />
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-2">
              <span className="pl-2 text-sm font-medium text-muted-foreground">
                Appearance
              </span>

              <ThemeToggle />
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Liquid Background
function LiquidBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Green Liquid */}
      <div className="absolute -left-40 -top-40 h-[450px] w-[450px] animate-liquid-one rounded-full bg-green-400/20 blur-[110px] dark:bg-green-500/15" />

      {/* Emerald Liquid */}
      <div className="absolute -right-40 top-[15%] h-[500px] w-[500px] animate-liquid-two rounded-full bg-emerald-400/20 blur-[120px] dark:bg-emerald-500/15" />

      {/* Lime Liquid */}
      <div className="absolute -bottom-48 left-[25%] h-[500px] w-[500px] animate-liquid-three rounded-full bg-lime-300/20 blur-[120px] dark:bg-lime-500/10" />

      {/* Teal Liquid */}
      <div className="absolute right-[20%] top-[45%] h-[350px] w-[350px] animate-liquid-one rounded-full bg-teal-300/15 blur-[110px] dark:bg-teal-500/10" />
    </div>
  );
}

// Main Navbar
export function NavBerPage() {
  return (
    <>
      {/* Liquid Background */}
      <LiquidBackground />

      {/* Navbar */}
      <header className="sticky top-3 z-50">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-5">
          <nav
            aria-label="Main navigation"
            className="flex h-16 items-center justify-between gap-3 rounded-full border border-border/80 bg-nav/90 pr-2.5 pl-4 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 dark:shadow-black/20 sm:pl-6"
          >
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <DesktopNavLinks />

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle className="hidden lg:inline-flex" />

              <span className="hidden h-6 w-px bg-border lg:block" />

              <AuthButtons className="hidden sm:flex" />

              <MobileMenu />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
