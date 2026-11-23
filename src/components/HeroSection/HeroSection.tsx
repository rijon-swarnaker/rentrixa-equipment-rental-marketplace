"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "framer-motion"
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

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// Each block fades and lifts into place.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
}

// The parent staggers its children so the hero reveals one piece at a time.
const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.15 },
  },
}

const featureStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.55 },
  },
}

const featureItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
}

export default function HeroSectionPage() {
  const [activeImage, setActiveImage] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  // Switch the background image every 7 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImage((current) => (current + 1) % BACKGROUND_IMAGES.length)
    }, 7000)

    return () => clearInterval(timer)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate flex min-h-[660px] flex-col justify-center overflow-hidden lg:min-h-[720px]">
        {/* ---------------- Background carousel ---------------- */}
        <div className="absolute inset-0 -z-10">
          {BACKGROUND_IMAGES.map((image, index) => (
            <motion.div
              key={image}
              className="absolute inset-0"
              initial={
                index === activeImage ? { opacity: 1, scale: 1 } : { opacity: 0 }
              }
              animate={{
                opacity: index === activeImage ? 1 : 0,
                // Slow zoom while the image is on screen.
                scale: prefersReducedMotion
                  ? 1
                  : index === activeImage
                    ? 1.06
                    : 1,
              }}
              transition={{
                opacity: { duration: 1.1, ease: "easeInOut" },
                scale: { duration: 7, ease: "linear" },
              }}
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
          <motion.div
            className="max-w-2xl"
            variants={stagger}
            initial={prefersReducedMotion ? false : "hidden"}
            animate="visible"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur dark:border-green-400/25 dark:bg-green-400/10 dark:text-green-300"
            >
              <ShieldCheck className="size-4" />
              Your Trusted Equipment Rental Partner
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              The Right Equipment.
              <span className="block text-primary dark:text-green-400">
                Ready When You Are.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg dark:text-white/70"
            >
              Discover, rent, and manage professional equipment with ease.
              Connect with trusted owners and get the tools you need for every
              project.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/all-equipment"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group h-12 gap-2 rounded-full px-6 text-base shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                )}
              >
                <Search className="size-5" />
                Explore Equipment
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-10 grid max-w-md grid-cols-3 divide-x divide-border/70"
            >
              {STATS.map(({ icon: Icon, value, label }, index) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-2.5",
                    index > 0 && "pl-4"
                  )}
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
            </motion.div>

            {/* Carousel dots */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex items-center gap-2"
            >
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
            </motion.div>
          </motion.div>
        </div>

        {/* ---------------- Feature strip ---------------- */}
        <motion.div
          className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-8 sm:px-6"
          variants={featureStagger}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-2xl border border-border/70 bg-card/95 p-5 shadow-xl shadow-black/5 backdrop-blur-md sm:p-6 lg:grid-cols-4 lg:gap-0">
            {FEATURES.map(({ icon: Icon, title, subtitle }, index) => (
              <motion.div
                key={title}
                variants={featureItem}
                className={cn(
                  "group flex items-center gap-3",
                  index > 0 && "lg:border-l lg:border-border/70 lg:pl-5"
                )}
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 dark:bg-green-400/10 dark:text-green-400">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {title}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-white/60">
                    {subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </MotionConfig>
  )
}
