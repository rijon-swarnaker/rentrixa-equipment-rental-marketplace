"use client";

import { useRef } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  Mail,
  MessageCircle,
  MessageSquare,
  Send,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SUBJECTS = [
  "General Inquiry",
  "Booking Support",
  "Equipment Listing",
  "Payment & Billing",
  "Partnership",
  "Something Else",
];

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);

  // This is a static contact form, so it only confirms and clears itself.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();

    toast.success(
      name
        ? `Thanks, ${name}! Your message has been sent.`
        : "Thanks! Your message has been sent."
    );

    formRef.current?.reset();
  };

  return (
    <div className="animate-fade-up rounded-3xl border border-border bg-card p-5 shadow-xl shadow-primary/5 sm:p-7" style={{ animationDelay: "180ms" }}>
      {/* Card header */}
      <div className="flex items-start gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <MessageCircle className="size-6" />
        </span>

        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Send Us a Message
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill out the form below and we&apos;ll get back to you soon.
          </p>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <label htmlFor="contact-name" className="sr-only">
              Your Name
            </label>
            <UserRound className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="contact-name"
              name="name"
              required
              autoComplete="name"
              placeholder="Your Name *"
              className="h-11 rounded-xl pl-10"
            />
          </div>

          <div className="relative">
            <label htmlFor="contact-email" className="sr-only">
              Your Email
            </label>
            <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Your Email *"
              className="h-11 rounded-xl pl-10"
            />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="contact-subject" className="sr-only">
            Select Subject
          </label>
          <LayoutGrid className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <select
            id="contact-subject"
            name="subject"
            required
            defaultValue=""
            className="h-11 w-full appearance-none rounded-xl border border-input bg-transparent pr-10 pl-10 text-sm text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30"
          >
            <option value="" disabled>
              Select Subject
            </option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        <div className="relative">
          <label htmlFor="contact-message" className="sr-only">
            Your Message
          </label>
          <MessageSquare className="pointer-events-none absolute top-4 left-3.5 size-4 text-muted-foreground" />
          <Textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder="Your Message..."
            className="min-h-36 resize-none rounded-xl py-3.5 pl-10"
          />
        </div>

        <Button
          type="submit"
          className="group h-12 w-full rounded-xl text-sm font-semibold shadow-sm"
        >
          <Send className="size-4 transition-transform group-hover:-translate-y-0.5" />
          Send Message
          <ArrowRight className="ml-auto size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
