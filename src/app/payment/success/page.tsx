
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ArrowRight, Check, Heart, Home } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
});

type Piece = {
  x: number;
  y: number;
  r: number;
  color: string;
  shape?: "pill" | "small" | "dot";
};

const pieces: Piece[] = [
  { x: -168, y: -24, r: 35, color: "bg-amber-400" },
  { x: -106, y: -52, r: -55, color: "bg-green-600", shape: "small" },
  { x: -238, y: 18, r: 35, color: "bg-green-500" },
  { x: -178, y: 56, r: -35, color: "bg-green-700" },
  { x: -118, y: 30, r: 35, color: "bg-lime-500" },
  { x: -102, y: 60, r: -40, color: "bg-lime-500", shape: "small" },
  { x: -215, y: 40, r: 0, color: "bg-lime-300", shape: "dot" },
  { x: -92, y: -12, r: 0, color: "bg-green-300", shape: "dot" },
  { x: 106, y: -56, r: -40, color: "bg-green-700", shape: "small" },
  { x: 168, y: -26, r: -35, color: "bg-amber-400" },
  { x: 118, y: 6, r: -35, color: "bg-lime-500" },
  { x: 232, y: 22, r: -35, color: "bg-green-500" },
  { x: 160, y: 58, r: 40, color: "bg-green-600" },
  { x: 98, y: 56, r: 40, color: "bg-lime-500", shape: "small" },
  { x: 118, y: -22, r: 0, color: "bg-lime-300", shape: "dot" },
  { x: 205, y: 44, r: 0, color: "bg-green-300", shape: "dot" },
];

const shapeClass = {
  pill: "h-2 w-5",
  small: "h-1.5 w-4",
  dot: "h-1.5 w-1.5",
} as const;

function Leaf({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 200"
      className={cn("absolute bottom-0 left-0 origin-bottom", className)}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M50 200 C8 150 -4 78 50 0 C104 78 92 150 50 200 Z"
        fill="currentColor"
      />
      <path
        d="M50 196 L50 24"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function LeafCluster({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute bottom-0 h-64 w-52 md:h-80 md:w-64",
        className,
      )}
    >
      <Leaf
        className="h-44 w-20 -translate-x-6 translate-y-6 text-green-400/80 md:h-56 md:w-24"
        style={{ rotate: "8deg" }}
      />
      <Leaf
        className="h-36 w-16 translate-x-2 translate-y-8 text-green-500/80 md:h-48 md:w-20"
        style={{ rotate: "38deg" }}
      />
      <Leaf
        className="h-32 w-16 translate-x-8 translate-y-10 text-green-300/90 md:h-40 md:w-20"
        style={{ rotate: "62deg" }}
      />
      <Leaf
        className="h-28 w-14 translate-x-4 translate-y-14 text-green-600/70 md:h-36 md:w-16"
        style={{ rotate: "86deg" }}
      />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main
      className={cn(
        jakarta.className,
        "relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16",
        "bg-gradient-to-b from-green-50 via-white to-green-50",
        "dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
        "transition-colors duration-300",
      )}
    >
      {/* Background decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-green-200/50 blur-3xl dark:bg-green-900/20" />

        <div className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-emerald-100/70 blur-3xl dark:bg-emerald-900/20" />

        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute bottom-0 h-1/3 w-full"
        >
          <defs>
            <linearGradient id="wave" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          <path
            fill="url(#wave)"
            className="opacity-70 dark:opacity-10"
            d="M0 200 C240 120 420 280 720 210 C1020 140 1200 260 1440 180 L1440 320 L0 320 Z"
          />

          <path
            fill="#86efac"
            fillOpacity="0.25"
            className="dark:opacity-10"
            d="M0 250 C300 190 520 310 820 250 C1100 195 1280 290 1440 240 L1440 320 L0 320 Z"
          />
        </svg>
      </div>

      <LeafCluster className="left-0 opacity-80 dark:opacity-25" />
      <LeafCluster className="right-0 -scale-x-100 opacity-80 dark:opacity-25" />

      {/* Main content */}
      <section
        role="status"
        className="relative z-10 flex max-w-2xl flex-col items-center text-center"
      >
        {/* Success badge */}
        <div className="relative mb-10 size-36 animate-in fade-in zoom-in-50 duration-500">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-0 scale-75 sm:scale-100"
          >
            {pieces.map((p, i) => (
              <span
                key={i}
                className={cn(
                  "absolute left-0 top-0 rounded-full",
                  p.color,
                  shapeClass[p.shape ?? "pill"],
                )}
                style={{
                  transform: `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) rotate(${p.r}deg)`,
                }}
              />
            ))}
          </div>

          <div className="flex size-full items-center justify-center rounded-full bg-gradient-to-b from-green-400 to-green-600 shadow-[0_20px_45px_-12px_rgba(22,163,74,0.65)] ring-[10px] ring-green-500/15">
            <div className="flex size-[88%] items-center justify-center rounded-full border-[3px] border-white/30 bg-gradient-to-b from-green-500 to-green-600">
              <Check className="size-16 text-white" strokeWidth={4} />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-6xl">
          Payment{" "}
          <span className="text-green-600 dark:text-green-400">
            Successful!
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl">
          Your payment has been processed successfully.
          <br />
          Thank you for using Rentrixa!{" "}
          <Heart
            aria-hidden="true"
            className="inline size-5 -translate-y-0.5 fill-green-500 text-green-500"
          />
        </p>

        {/* Home button */}
        <Link
          href="/"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-10 h-14 rounded-full bg-green-600 px-10 text-base font-semibold text-white shadow-lg shadow-green-600/30 hover:bg-green-700 dark:bg-green-500 dark:text-slate-950 dark:hover:bg-green-400",
          )}
        >
          <Home className="size-5" />
          Go to Home
          <ArrowRight className="size-5" />
        </Link>
      </section>
    </main>
  );
}
