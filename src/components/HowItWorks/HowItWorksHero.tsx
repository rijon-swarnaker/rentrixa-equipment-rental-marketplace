import { ShieldCheck, Star, Users, Workflow } from "lucide-react";

import { Badge } from "@/components/ui/badge";

// Small trust strip, matching the home page hero.
const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Secure payments" },
  { icon: Users, label: "5K+ happy renters" },
  { icon: Star, label: "4.8/5 user rating" },
];

const HowItWorksHero = () => {
  return (
    <section className="relative overflow-hidden border-b border-primary/10 bg-gradient-to-br from-primary/[0.08] via-background to-primary/[0.12]">
      {/* Soft shapes + a faint process icon, like the other public pages. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-20 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 left-1/4 size-72 rounded-full bg-primary/[0.07] blur-3xl" />
        <Workflow className="absolute -right-8 -bottom-10 size-64 text-primary/[0.07] rotate-6 sm:size-80" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-2xl">
          <Badge
            variant="secondary"
            className="animate-fade-up gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary"
          >
            <Workflow className="size-3.5" />
            Simple 4-step process
          </Badge>

          <h1
            style={{ animationDelay: "80ms" }}
            className="animate-fade-up mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            How It <span className="text-primary">Works</span>
          </h1>

          <p
            style={{ animationDelay: "140ms" }}
            className="animate-fade-up mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            Renting professional equipment is quick and easy. Browse, book,
            and get to work — we&apos;ll guide you through every step.
          </p>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
            {HIGHLIGHTS.map((highlight, index) => {
              const Icon = highlight.icon;

              return (
                <div
                  key={highlight.label}
                  style={{ animationDelay: `${200 + index * 80}ms` }}
                  className="animate-fade-up flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-3.5" />
                  </span>
                  {highlight.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHero;
