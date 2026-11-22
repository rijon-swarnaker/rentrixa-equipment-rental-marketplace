import type { LucideIcon } from "lucide-react";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  MapPin,
  PackageCheck,
  SearchCheck,
  Wallet,
} from "lucide-react";

import HowItWorksHero from "@/components/HowItWorks/HowItWorksHero";
import StepCard from "@/components/HowItWorks/StepCard";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TStep = {
  icon: LucideIcon;
  title: string;
  description: string;
  note: string;
};

// Each icon matches what actually happens in that step.
const STEPS: TStep[] = [
  {
    icon: SearchCheck,
    title: "Browse Equipment",
    description:
      "Search our collection of verified equipment and find the right tool for your project.",
    note: "Search by name, category or price",
  },
  {
    icon: CalendarDays,
    title: "Book Your Dates",
    description:
      "Check availability, choose your rental period and send a booking request to the owner.",
    note: "Flexible daily, weekly or monthly",
  },
  {
    icon: CreditCard,
    title: "Confirm & Pay",
    description:
      "Once approved, confirm your booking and complete a secure payment in just a few clicks.",
    note: "Safe and transparent pricing",
  },
  {
    icon: PackageCheck,
    title: "Pick Up & Start",
    description:
      "Collect your equipment from the owner and get to work with everything ready to go.",
    note: "Support whenever you need it",
  },
];

type TTip = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const BEFORE_YOU_START: TTip[] = [
  {
    icon: BadgeCheck,
    title: "A valid ID",
    description: "Keep an ID ready for owner verification.",
  },
  {
    icon: Wallet,
    title: "A payment method",
    description: "Have a card or mobile payment ready.",
  },
  {
    icon: MapPin,
    title: "Pickup details",
    description: "Check the pickup place and time first.",
  },
];

export const metadata = {
  title: "How It Works | Rentrixa",
  description:
    "Learn how easy it is to browse, book and rent equipment on Rentrixa in four simple steps.",
};

const HowItWorksPage = () => {
  return (
    <div className="w-full">
      <HowItWorksHero />

      {/* Steps */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="animate-fade-up text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Get started in <span className="text-primary">4 easy steps</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            From searching to starting your project, here&apos;s what the
            process looks like.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <StepCard key={step.title} {...step} index={index} />
          ))}
        </div>
      </section>

      {/* Quick preparation checklist */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">
        <Card className="border-border/70 bg-primary/[0.03] shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="animate-fade-up flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardCheck className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold sm:text-xl">
                  Before you start
                </h2>
                <p className="text-sm text-muted-foreground">
                  A little preparation makes booking even faster.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {BEFORE_YOU_START.map((tip, index) => {
                const Icon = tip.icon;

                return (
                  <div
                    key={tip.title}
                    style={{ animationDelay: `${200 + index * 80}ms` }}
                    className="animate-fade-up flex items-start gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{tip.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to action */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <div
          style={{ animationDelay: "120ms" }}
          className="animate-fade-up relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.06] p-6 shadow-sm sm:p-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-primary/10 blur-2xl"
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Ready to find the right equipment?
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
                Explore trusted equipment from owners near you.
              </p>
            </div>

            <Link
              href="/all-equipment"
              className={cn(
                buttonVariants(),
                "h-10 w-fit gap-2 rounded-full px-5 text-sm"
              )}
            >
              Browse Equipment
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
