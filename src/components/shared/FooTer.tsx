import type { ComponentType, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronRight,
  Clock,
  Headphones,
  Heart,
  Link2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react"

import { Separator } from "@/components/ui/separator"

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/all-equipment" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Help Center", href: "/help" },
]

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    content: (
      <>
        123 Innovation Drive,
        <br />
        Dhaka 1207, Bangladesh
      </>
    ),
  },
  {
    icon: Mail,
    content: (
      <a href="mailto:support@rentrixa.com" className="transition-colors hover:text-primary dark:hover:text-green-400">
        support@rentrixa.com
      </a>
    ),
  },
  {
    icon: Phone,
    content: (
      <a href="tel:+8801700123456" className="transition-colors hover:text-primary dark:hover:text-green-400">
        +880 1700 123 456
      </a>
    ),
  },
  {
    icon: Clock,
    content: <>Mon – Sat: 9:00 AM – 9:00 PM</>,
  },
]

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedInIcon },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "X", href: "https://x.com", icon: XIcon },
]

/** Section wrapper shared by the link and contact columns. */
function FooterColumn({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: ComponentType<{ className?: string }>
  children: ReactNode
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2.5 text-base font-semibold text-foreground dark:text-white">
        <Icon className="size-5 text-primary dark:text-green-400" />
        {title}
      </h3>
      {children}
    </div>
  )
}

/** Small chip that mimics the payment provider logos in the reference. */
function PaymentBadge({ children, label }: { children: ReactNode; label: string }) {
  return (
    <span className="flex h-7 w-12 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-black/5">
      <span className="sr-only">{label}</span>
      {children}
    </span>
  )
}

function PaymentMethods() {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
      <li>
        <PaymentBadge label="Visa">
          <span className="text-[11px] font-black italic tracking-tight text-[#1a1f71]">VISA</span>
        </PaymentBadge>
      </li>
      <li>
        <PaymentBadge label="Mastercard">
          <span className="flex items-center">
            <span className="size-3.5 rounded-full bg-[#eb001b]" />
            <span className="-ml-1.5 size-3.5 rounded-full bg-[#f79e1b] opacity-90" />
          </span>
        </PaymentBadge>
      </li>
      <li>
        <PaymentBadge label="Stripe">
          <span className="text-[10px] font-bold text-[#635bff]">stripe</span>
        </PaymentBadge>
      </li>
      <li>
        <PaymentBadge label="PayPal">
          <span className="text-[10px] font-black italic text-[#003087]">
            Pay<span className="text-[#009cde]">Pal</span>
          </span>
        </PaymentBadge>
      </li>
    </ul>
  )
}

const FooTerPage = () => {
  return (
    <footer className="mt-auto px-3 pt-12 pb-3 sm:px-5 sm:pb-5">
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-border/70 bg-linear-to-br from-emerald-50 via-background to-emerald-50/40 shadow-lg shadow-black/5 dark:border-white/10 dark:from-[#04130d] dark:via-[#061a13] dark:to-[#020c07] dark:shadow-black/40">
        {/* Hairline highlight along the top edge */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent dark:via-green-400/50"
        />

        {/* Soft brand glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-10 size-72 rounded-full bg-primary/10 blur-3xl dark:bg-green-400/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-16 size-64 rounded-full bg-primary/10 blur-3xl dark:bg-emerald-500/10"
        />

        <div className="relative px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
          <h2 className="sr-only">Footer</h2>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr] lg:gap-0">
            {/* Brand */}
            <div className="flex flex-col items-start gap-4 lg:pr-10">
              <Link href="/" aria-label="Rentrixa home" className="inline-flex">
                <Image
                  src="/assets/Logo.png"
                  alt="Rentrixa"
                  width={2172}
                  height={724}
                  className="h-10 w-auto dark:brightness-0 dark:invert"
                />
              </Link>

              <p className="text-sm font-semibold text-primary dark:text-green-400">
                Rent Smarter. Work Better.
              </p>

              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground dark:text-white/60">
                The premium equipment rental marketplace connecting equipment owners
                and customers. Rent professional equipment for any project, anytime,
                anywhere.
              </p>

              <ul className="mt-2 flex items-center gap-2.5" aria-label="Social media">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/60 text-foreground/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white/70 dark:hover:border-green-400 dark:hover:bg-green-500 dark:hover:text-emerald-950"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <div className="lg:border-l lg:border-border/70 lg:px-10 lg:dark:border-white/10">
              <FooterColumn title="Quick Links" icon={Link2}>
                <ul className="mt-5 flex flex-col gap-0.5">
                  {QUICK_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center justify-between gap-4 rounded-lg py-1.5 text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:text-white/60 dark:hover:text-green-400"
                      >
                        {link.label}
                        <ChevronRight className="size-4 shrink-0 opacity-60 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            </div>

            {/* Contact */}
            <div className="lg:border-l lg:border-border/70 lg:pl-10 lg:dark:border-white/10">
              <FooterColumn title="Contact Information" icon={Headphones}>
                <ul className="mt-5 flex flex-col gap-4">
                  {CONTACT_DETAILS.map(({ icon: Icon, content }, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-green-400/10 dark:text-green-400">
                        <Icon className="size-4" />
                      </span>
                      <p className="text-sm leading-relaxed text-muted-foreground dark:text-white/60">
                        {content}
                      </p>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>

          <Separator className="my-8 bg-border/70 dark:bg-white/10" />

          <div className="flex flex-col gap-4 text-sm text-muted-foreground lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-y-4 dark:text-white/55">
            <p>© 2026 Rentrixa. All rights reserved.</p>

            <p className="flex items-center gap-1.5 lg:border-l lg:border-border/70 lg:pl-6 lg:dark:border-white/10">
              Made with
              <Heart
                role="img"
                aria-label="love"
                className="size-4 fill-emerald-500 text-emerald-500 dark:fill-green-400 dark:text-green-400"
              />
              for a smarter, greener and more productive world.
            </p>

            <p className="flex items-center gap-2 lg:border-l lg:border-border/70 lg:pl-6 lg:dark:border-white/10">
              <ShieldCheck className="size-5 text-primary dark:text-green-400" />
              Secure &amp; Trusted Marketplace
            </p>

            <div className="lg:border-l lg:border-border/70 lg:pl-6 lg:dark:border-white/10">
              <PaymentMethods />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooTerPage

/* ---------------------------------------------------------------- */
/* Brand icons (lucide no longer ships brand marks)                  */
/* ---------------------------------------------------------------- */

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.78C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.78 24h20.44c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.9 2H22l-6.77 7.74L23 22h-6.9l-5.4-7.06L4.5 22H1.4l7.24-8.28L1 2h7.06l4.88 6.45L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.36L17.7 20Z" />
    </svg>
  )
}
