import type { Metadata } from "next";
import {
  Headphones,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";

import ContactForm from "@/components/Contact/ContactForm";
import {
  FacebookIcon,
  GithubIcon,
  LinkedInIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/Contact/social-icons";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Contact Us | Rentrixa",
  description:
    "Get in touch with the Rentrixa team for help, questions, or partnership inquiries.",
};

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: "Email Us",
    value: "support@rentrixa.com",
    href: "mailto:support@rentrixa.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+880 1712 345678",
    href: "tel:+8801712345678",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "Dhaka, Bangladesh",
    href: "https://maps.google.com/?q=Dhaka,Bangladesh",
  },
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com", icon: GithubIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedInIcon },
  { label: "X", href: "https://x.com", icon: XIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
];

const ContactPage = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/[0.07] via-background to-primary/[0.04]">
      {/* Soft page decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-20 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -left-24 size-72 rounded-full bg-primary/[0.07] blur-3xl" />
        <Leaf className="absolute top-10 right-6 size-28 rotate-12 fill-primary/15 text-primary/30 sm:size-36" />
        <Leaf className="absolute top-24 right-24 hidden size-16 -rotate-12 fill-primary/10 text-primary/25 sm:block" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-12 xl:items-start xl:gap-8">
          {/* Left: intro + contact cards */}
          <div className="animate-fade-up md:col-span-1 xl:col-span-4">
            <Badge
              variant="outline"
              className="gap-2 rounded-full border-primary/20 bg-primary/10 px-3.5 py-1 text-primary"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Contact Us
            </Badge>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Contact{" "}
              <span className="relative inline-block text-primary">
                Us
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  fill="none"
                  className="absolute -bottom-2 left-0 h-2.5 w-full text-primary/60"
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

            <p className="mt-7 text-sm font-semibold text-foreground sm:text-base">
              Have any questions? We&apos;d love to hear from you!
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Whether you need help, have a suggestion, or want to partner with
              us — feel free to reach out. Our team is always here to assist
              you.
            </p>

            <div className="mt-7 space-y-3">
              {CONTACT_CARDS.map((card, index) => {
                const Icon = card.icon;

                return (
                  <a
                    key={card.title}
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      card.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    style={{ animationDelay: `${120 + index * 70}ms` }}
                    className="animate-fade-up flex items-center gap-3.5 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/[0.08] to-transparent p-3.5 transition-all hover:border-primary/40 hover:shadow-sm"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                      <Icon className="size-5" />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-semibold sm:text-base">
                        {card.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground sm:text-sm">
                        {card.value}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Middle: support illustration */}
          <div
            aria-hidden="true"
            className="relative hidden min-h-[340px] items-center justify-center md:col-span-1 md:flex xl:col-span-3"
          >
            <div className="relative flex w-full items-center justify-center">
              <div className="absolute inset-x-2 top-12 bottom-6 rounded-[2rem] bg-gradient-to-br from-primary/15 via-primary/[0.06] to-transparent" />

              {/* Speech bubble */}
              <div className="animate-fade-up absolute top-0 right-0 z-10 max-w-[150px] rounded-2xl rounded-bl-sm border border-primary/25 bg-card px-3 py-2 text-center text-xs font-semibold shadow-sm sm:text-sm">
                We&apos;re here to help!
              </div>

              {/* Support avatar */}
              <div className="relative z-[1] flex size-40 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-700 text-primary-foreground shadow-2xl shadow-primary/30 ring-8 ring-primary/10 lg:size-44">
                <Headphones className="size-18 lg:size-20" />

                <span className="absolute -right-2 bottom-4 flex size-10 items-center justify-center rounded-full border-4 border-background bg-card text-primary shadow-sm">
                  <MessageCircle className="size-5" />
                </span>
              </div>

              {/* Floating accents */}
              <Sparkles className="absolute top-6 left-0 size-7 text-primary/40" />
              <Leaf className="absolute right-1 bottom-2 size-10 rotate-12 fill-primary/20 text-primary/40" />
              <span className="absolute bottom-16 left-6 size-3 rounded-full bg-primary/30" />
              <span className="absolute top-24 right-4 size-2 rounded-full bg-primary/25" />
            </div>
          </div>

          {/* Right: contact form */}
          <div className="md:col-span-2 xl:col-span-5">
            <ContactForm />
          </div>
        </div>

        {/* Follow us */}
        <div className="animate-fade-up relative mt-8 overflow-hidden rounded-3xl border border-border bg-card/80 p-5 shadow-sm sm:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block"
          >
            <svg
              viewBox="0 0 400 120"
              fill="currentColor"
              className="absolute right-0 bottom-0 h-full w-full text-primary/[0.08]"
            >
              <rect x="2" y="74" width="24" height="46" rx="2" />
              <rect x="32" y="58" width="18" height="62" rx="2" />
              <rect x="56" y="84" width="30" height="36" rx="2" />
              <rect x="92" y="48" width="16" height="72" rx="2" />
              <rect x="114" y="68" width="28" height="52" rx="2" />
              <rect x="148" y="56" width="18" height="64" rx="2" />
              <rect x="172" y="88" width="34" height="32" rx="2" />
              <rect x="240" y="70" width="22" height="50" rx="2" />
              <rect x="268" y="54" width="16" height="66" rx="2" />
              <rect x="290" y="80" width="30" height="40" rx="2" />
              <path d="M340 22h4v98h-4z" />
              <path d="M342 24h54v4h-54z" />
              <path d="M392 24h4v18h-4z" />
            </svg>
          </div>

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Follow Us</h2>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Stay connected with us on social media.
              </p>
            </div>

            <span
              aria-hidden="true"
              className="hidden h-14 w-px bg-border md:block"
            />

            <ul className="flex flex-wrap items-center gap-3">
              {SOCIALS.map((social) => {
                const Icon = social.icon;

                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex size-11 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
