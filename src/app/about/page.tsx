import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  HardHat,
  Headphones,
  HeartHandshake,
  Leaf,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Tractor,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us | Rentrixa",
  description:
    "Rentrixa is a trusted equipment rental marketplace connecting equipment owners with renters for construction, photography, vehicles, agriculture, electronics, and events.",
};

// Quick brand numbers shown under the hero.
const STATS = [
  { value: "500+", label: "Equipment listings" },
  { value: "5K+", label: "Happy renters" },
  { value: "6", label: "Rental categories" },
  { value: "24/7", label: "Customer support" },
];

// Small trust chips in the hero.
const TRUST_POINTS = [
  { icon: BadgeCheck, label: "Verified owners" },
  { icon: ShieldCheck, label: "Secure payments" },
  { icon: Headphones, label: "24/7 support" },
];

// What we believe in, shown as four cards.
const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trusted Marketplace",
    description:
      "Every owner is verified and every listing is reviewed, so you can rent with confidence.",
  },
  {
    icon: Wallet,
    title: "Fair, Clear Pricing",
    description:
      "Know the full price before you book. No hidden fees, whether you rent for a day or a month.",
  },
  {
    icon: Zap,
    title: "Fast & Easy",
    description:
      "Search, compare, and book professional equipment in just a few simple clicks.",
  },
  {
    icon: HeartHandshake,
    title: "Support That Cares",
    description:
      "Real people ready to help with bookings, payments, and rental questions — any time.",
  },
];

// A small photo collage that shows the wide range of equipment.
const STORY_IMAGES = [
  {
    src: "/assets/Photography-Equipment.png",
    alt: "Professional camera available to rent",
  },
  {
    src: "/assets/Agriculture-Equipment.png",
    alt: "Tractor available to rent",
  },
  {
    src: "/assets/Electronics.png",
    alt: "Laptop available to rent",
  },
  {
    src: "/assets/Event-Equipment.png",
    alt: "Event tent available to rent",
    photo: true,
  },
];

const RENTER_POINTS = [
  "Access six equipment categories in one place",
  "Flexible daily, weekly, and monthly rentals",
  "Verified owners and secure booking",
];

const OWNER_POINTS = [
  "List your equipment in a few simple steps",
  "Track bookings and rentals from your dashboard",
  "Reach renters looking for exactly what you offer",
];

type SectionHeadingProps = {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  accent: string;
  description: string;
};

// Shared heading used by the lower sections so they stay consistent.
const SectionHeading = ({
  eyebrow,
  icon: Icon,
  title,
  accent,
  description,
}: SectionHeadingProps) => {
  return (
    <div className="animate-fade-up text-center">
      <div className="flex items-center justify-center gap-3">
        <span
          aria-hidden="true"
          className="h-px w-10 bg-gradient-to-r from-transparent to-primary/40 sm:w-16"
        />

        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm sm:text-sm">
          <Icon className="size-3.5 sm:size-4" />
          {eyebrow}
        </span>

        <span
          aria-hidden="true"
          className="h-px w-10 bg-gradient-to-l from-transparent to-primary/40 sm:w-16"
        />
      </div>

      <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:mt-5 sm:text-4xl">
        {title} <span className="text-primary">{accent}</span>
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-sm text-pretty text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="bg-background">
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden border-b border-primary/10 bg-gradient-to-br from-primary/[0.08] via-background to-primary/[0.12]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-20 size-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-28 left-1/4 size-72 rounded-full bg-primary/[0.07] blur-3xl" />
          <Leaf className="absolute top-10 left-4 size-24 rotate-12 fill-primary/10 text-primary/20 sm:size-32" />
          <Tractor className="absolute -right-10 -bottom-10 size-56 -rotate-6 text-primary/[0.07] sm:size-72" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20 lg:pb-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
            {/* Intro */}
            <div>
              <Badge
                variant="outline"
                className="animate-fade-up gap-2 rounded-full border-primary/20 bg-primary/10 px-3.5 py-1 text-primary"
              >
                <Sparkles className="size-3.5" />
                About Rentrixa
              </Badge>

              <h1
                style={{ animationDelay: "80ms" }}
                className="animate-fade-up mt-5 text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-[3.4rem]"
              >
                Rent Smarter.
                <span className="relative mt-1 block text-primary">
                  Build Better.
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                    fill="none"
                    className="absolute -bottom-2 left-0 h-2.5 w-3/4 text-primary/50"
                  >
                    <path
                      d="M2 8C18 3 38 2 58 5c14 2 26 3 40 1"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p
                style={{ animationDelay: "140ms" }}
                className="animate-fade-up mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
              >
                Rentrixa is a trusted equipment rental marketplace that connects
                people who need professional equipment with owners who have it.
                From construction sites to wedding stages, we make renting
                simple, flexible, and affordable.
              </p>

              <div
                style={{ animationDelay: "200ms" }}
                className="animate-fade-up mt-6 flex flex-wrap gap-x-5 gap-y-3"
              >
                {TRUST_POINTS.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm"
                  >
                    <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-3.5" />
                    </span>
                    {label}
                  </span>
                ))}
              </div>

              <div
                style={{ animationDelay: "260ms" }}
                className="animate-fade-up mt-8 flex flex-wrap gap-3"
              >
                <Link
                  href="/all-equipment"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group h-12 gap-2 rounded-full px-6 text-base shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                  )}
                >
                  Browse Equipment
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/how-it-works"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 gap-2 rounded-full border-border bg-background/70 px-6 text-base backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-background"
                  )}
                >
                  How It Works
                </Link>
              </div>
            </div>

            {/* Hero image */}
            <div
              style={{ animationDelay: "180ms" }}
              className="animate-fade-up relative mx-auto w-full max-w-lg lg:max-w-none"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-4 border-background shadow-2xl shadow-primary/20 ring-1 ring-primary/15">
                <Image
                  src="/assets/Hero-layer-1.png"
                  alt="Excavator working on a construction site at sunset"
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover dark:brightness-90"
                />
              </div>

              {/* Floating stat cards */}
              <div className="absolute top-3 right-3 flex items-center gap-2 rounded-xl border border-primary/15 bg-card/95 px-3 py-2 shadow-lg backdrop-blur sm:top-5 sm:right-4 xl:-right-4">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HardHat className="size-4" />
                </span>
                <span>
                  <span className="block text-sm leading-tight font-bold">
                    500+
                  </span>
                  <span className="block text-[10px] text-muted-foreground sm:text-xs">
                    Equipment listings
                  </span>
                </span>
              </div>

              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl border border-primary/15 bg-card/95 px-3 py-2 shadow-lg backdrop-blur sm:bottom-5 sm:-left-4">
                <span className="flex size-8 items-center justify-center rounded-lg bg-amber-400/20 text-amber-500">
                  <Star className="size-4 fill-current" />
                </span>
                <span>
                  <span className="block text-sm leading-tight font-bold">
                    4.8/5
                  </span>
                  <span className="block text-[10px] text-muted-foreground sm:text-xs">
                    5K+ happy renters
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Brand stats */}
          <dl
            style={{ animationDelay: "320ms" }}
            className="animate-fade-up mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-primary/15 bg-border shadow-sm sm:grid-cols-4"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-card px-4 py-5 text-center">
                <dt className="text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- Our Story ---------------- */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/3 -left-28 size-72 rounded-full bg-primary/[0.06] blur-3xl" />
          <Leaf className="absolute -top-6 right-2 size-28 -rotate-12 fill-primary/10 text-primary/20 sm:size-36" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Photo collage */}
            <div
              style={{ animationDelay: "80ms" }}
              className="animate-fade-up relative order-last mx-auto w-full max-w-xl lg:order-first lg:max-w-none"
            >
              <div className="grid grid-cols-2 gap-3 rounded-3xl border border-primary/15 bg-card p-3 shadow-xl shadow-primary/5 sm:gap-4 sm:p-4">
                {STORY_IMAGES.map((item) => (
                  <div
                    key={item.src}
                    className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 1023px) 50vw, 25vw"
                      className={cn(
                        "transition-transform duration-500 hover:scale-105",
                        item.photo
                          ? "object-cover"
                          : "object-contain p-3 mix-blend-multiply"
                      )}
                    />
                  </div>
                ))}

                <div className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-3 py-2.5 text-center text-xs font-semibold text-primary sm:text-sm">
                  <ShieldCheck className="size-4 shrink-0" />
                  Verified equipment. Trusted owners.
                </div>
              </div>
            </div>

            {/* Story copy */}
            <div>
              <Badge
                variant="outline"
                className="animate-fade-up gap-2 rounded-full border-primary/20 bg-primary/10 px-3.5 py-1 text-primary"
              >
                <Sparkles className="size-3.5" />
                Our Story
              </Badge>

              <h2
                style={{ animationDelay: "80ms" }}
                className="animate-fade-up mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
              >
                Built to keep projects{" "}
                <span className="text-primary">moving</span>
              </h2>

              <p
                style={{ animationDelay: "140ms" }}
                className="animate-fade-up mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base"
              >
                Rentrixa started with a simple observation: professional
                equipment is expensive to buy, yet it often sits idle between
                jobs. At the same time, project teams need reliable tools for a
                day, a week, or a season — without the cost and commitment of
                ownership.
              </p>

              <p
                style={{ animationDelay: "180ms" }}
                className="animate-fade-up mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base"
              >
                So we built one marketplace for both sides. Today, Rentrixa
                brings together construction machinery, photography gear,
                vehicles, agricultural equipment, electronics, and event
                supplies — helping owners earn from what they already have and
                renters get the right tool for the job.
              </p>

              <ul
                style={{ animationDelay: "220ms" }}
                className="animate-fade-up mt-6 space-y-2.5"
              >
                {[
                  "Verified equipment owners",
                  "Transparent pricing on every listing",
                  "Support from search to return",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                href="/all-equipment"
                style={{ animationDelay: "260ms" }}
                className="group animate-fade-up mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Explore all equipment
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Our Values ---------------- */}
      <section className="relative overflow-hidden border-y border-primary/10 bg-gradient-to-b from-background via-primary/[0.04] to-background py-16 sm:py-20 lg:py-24 dark:via-primary/[0.06]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/3 size-72 rounded-full bg-primary/[0.07] blur-3xl" />
          <div className="absolute -right-24 -bottom-20 size-80 rounded-full bg-primary/[0.08] blur-3xl" />
          <Leaf className="absolute bottom-6 left-3 size-24 rotate-12 fill-primary/10 text-primary/20 sm:size-32" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Values"
            icon={Target}
            title="What We"
            accent="Stand For"
            description="A marketplace only works when both sides can trust it. These principles guide everything we build."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  style={{ animationDelay: `${120 + index * 70}ms` }}
                  className="group animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                >
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" />
                  </span>

                  <h3 className="mt-4 text-base font-semibold">
                    {value.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Renters & Owners ---------------- */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute top-10 -right-24 size-72 rounded-full bg-primary/[0.05] blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="For Everyone"
            icon={Users}
            title="Made for Renters"
            accent="and Owners"
            description="Whether you need equipment or have equipment to share, Rentrixa is built to make the exchange simple."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {/* Renters */}
            <div
              style={{ animationDelay: "120ms" }}
              className="group animate-fade-up relative overflow-hidden rounded-3xl border border-primary/15 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 sm:p-8"
            >
              <div
                aria-hidden="true"
                className="absolute -top-12 -right-12 size-40 rounded-full bg-primary/10 blur-2xl"
              />

              <span className="relative flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Search className="size-6" />
              </span>

              <span className="relative mt-5 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                For Renters
              </span>

              <h3 className="relative mt-3 text-xl font-bold tracking-tight sm:text-2xl">
                The right equipment for every project.
              </h3>

              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                Stop buying tools you only need once. Find professional-grade
                equipment nearby and book it for exactly as long as you need.
              </p>

              <ul className="relative mt-5 space-y-2.5">
                {RENTER_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                href="/all-equipment"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "relative mt-6 h-11 gap-2 rounded-full px-5 text-sm shadow-sm"
                )}
              >
                Browse Equipment
                <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* Owners */}
            <div
              style={{ animationDelay: "190ms" }}
              className="animate-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-emerald-700 p-6 text-primary-foreground shadow-xl shadow-primary/20 sm:p-8"
            >
              <Tractor
                aria-hidden="true"
                className="absolute -right-6 -bottom-8 size-40 rotate-6 text-white/10 sm:size-52"
              />

              <span className="relative flex size-12 items-center justify-center rounded-xl bg-white/15 text-white">
                <TrendingUp className="size-6" />
              </span>

              <span className="relative mt-5 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                For Equipment Owners
              </span>

              <h3 className="relative mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
                Turn idle equipment into income.
              </h3>

              <p className="relative mt-2 text-sm leading-relaxed text-white/80">
                Your equipment can earn while it is not in use. List it on
                Rentrixa, manage bookings from one dashboard, and reach renters
                in your area.
              </p>

              <ul className="relative mt-5 space-y-2.5">
                {OWNER_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm text-white/90"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-200" />
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "relative mt-6 h-11 gap-2 rounded-full bg-white px-5 text-sm text-emerald-800 shadow-sm hover:bg-white/90"
                )}
              >
                Join as an Owner
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-emerald-600 to-emerald-700 px-6 py-12 text-center text-primary-foreground shadow-xl shadow-primary/20 sm:px-10 sm:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-16 size-72 rounded-full bg-white/10 blur-3xl" />
            <HardHat className="absolute -bottom-10 -left-6 size-40 -rotate-12 text-white/10 sm:size-52" />
            <Tractor className="absolute top-4 -right-4 size-32 rotate-6 text-white/10 sm:size-44" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white">
              <Sparkles className="size-3.5" />
              Start today
            </span>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-balance text-white sm:text-3xl lg:text-4xl">
              Ready to rent smarter?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              Whether you need equipment for your next project or want to earn
              from the equipment you own, Rentrixa makes it simple.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/all-equipment"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 gap-2 rounded-full bg-white px-6 text-base text-emerald-800 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90"
                )}
              >
                Browse Equipment
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 gap-2 rounded-full border-white/50 bg-transparent px-6 text-base text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                )}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
