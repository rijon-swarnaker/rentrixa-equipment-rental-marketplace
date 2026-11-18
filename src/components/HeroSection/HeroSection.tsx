"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  HardHat,
  Headphones,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Background images for the carousel (the content on top never changes).
const BACKGROUND_IMAGES = [
  "/assets/Hero-layer-1.png",
  "/assets/Hero-layer-2.png",
  "/assets/Hero-layer-3.png",
]

const STATS = [
  { icon: ShieldCheck, value: "100%", label: "Secure Payments" },
  { icon: Users, value: "5K+", label: "Happy Customers" },
  { icon: Star, value: "4.8/5", label: "User Rating" },
]

const FEATURES = [
  { icon: HardHat, title: "Professional", subtitle: "Equipment" },
  { icon: Zap, title: "Fast & Easy", subtitle: "Booking" },
  { icon: Headphones, title: "24/7", subtitle: "Support" },
  { icon: ShieldCheck, title: "Trusted", subtitle: "Marketplace" },
]

export default function HeroSectionPage() {
  const [activeImage, setActiveImage] = useState(0)

  // Switch the background image every 5 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImage((current) => (current + 1) % BACKGROUND_IMAGES.length)
    }, 7000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative isolate flex min-h-[660px] flex-col justify-center overflow-hidden lg:min-h-[720px]">
      {/* ---------------- Background carousel ---------------- */}
      <div className="absolute inset-0 -z-10">
        {BACKGROUND_IMAGES.map((image, index) => (
          <motion.div
            key={image}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: index === activeImage ? 1 : 0 }}
            transition={{ duration: 1 }}
          >
            <Image
              src={image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-right dark:brightness-75"
            />
          </motion.div>
        ))}

        {/* Overlays keep the text readable in both themes */}
        <div className="absolute inset-0 bg-linear-to-r from-white/95 via-white/85 to-white/60 lg:via-white/70 lg:to-transparent dark:from-[#050b08]/95 dark:via-[#050b08]/85 dark:to-[#050b08]/60 dark:lg:via-[#050b08]/70 dark:lg:to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/10 to-transparent dark:via-transparent" />
      </div>

  

      {/* ---------------- Static content ---------------- */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8 lg:pt-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur dark:border-green-400/25 dark:bg-green-400/10 dark:text-green-300">
            <ShieldCheck className="size-4" />
            Your Trusted Equipment Rental Partner
          </span>

          <h1 className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            The Right Equipment.
            <span className="block text-primary dark:text-green-400">
              Ready When You Are.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg dark:text-white/70">
            Discover, rent, and manage professional equipment with ease.
            Connect with trusted owners and get the tools you need for every
            project.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/all-equipment"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 gap-2 rounded-full px-6 text-base shadow-lg shadow-primary/25"
              )}
            >
              <Search className="size-5" />
              Explore Equipment
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/list-equipment"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 gap-2 rounded-full border-border bg-background/70 px-6 text-base backdrop-blur"
              )}
            >
              <Plus className="size-4" />
              List Your Equipment
            </Link>
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 divide-x divide-border/70">
            {STATS.map(({ icon: Icon, value, label }, index) => (
              <div
                key={label}
                className={cn("flex items-center gap-2.5", index > 0 && "pl-4")}
              >
                <Icon className="size-6 shrink-0 text-primary dark:text-green-400" />
                <div>
                  <p className="text-sm font-bold text-foreground">{value}</p>
                  <p className="text-[11px] text-muted-foreground sm:text-xs dark:text-white/60">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel dots */}
          <div className="mt-8 flex items-center gap-2">
            {BACKGROUND_IMAGES.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`Show background image ${index + 1}`}
                aria-pressed={index === activeImage}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === activeImage
                    ? "w-8 bg-primary dark:bg-green-400"
                    : "w-2.5 bg-foreground/25 hover:bg-foreground/50 dark:bg-white/30 dark:hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- Feature strip ---------------- */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-8 sm:px-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-2xl border border-border/70 bg-card/95 p-5 shadow-xl shadow-black/5 backdrop-blur-md sm:p-6 lg:grid-cols-4 lg:gap-0">
          {FEATURES.map(({ icon: Icon, title, subtitle }, index) => (
            <div
              key={title}
              className={cn(
                "flex items-center gap-3",
                index > 0 && "lg:border-l lg:border-border/70 lg:pl-5"
              )}
            >
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-green-400/10 dark:text-green-400">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground dark:text-white/60">
                  {subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
