import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CircleX,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import BookingSummaryCard from "@/components/Checkout/BookingSummaryCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { getBookingById } from "@/lib/api/booking";
import { cn } from "@/lib/utils";
import type { TBookingData } from "@/types";
import PayNowButton from "@/components/PayNowButton";

export const metadata = {
  title: "Checkout | Rentrixa",
  description: "Review your booking details and proceed to pay.",
};

const CheckoutPage = async ({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) => {
  const { bookingId } = await params;

  const result = await getBookingById(bookingId);

  if (!result.success) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/[0.06] via-background to-background">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-16 sm:px-6">
          <div className="animate-fade-up w-full max-w-md rounded-2xl border border-border/70 bg-card p-8 text-center shadow-sm">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <CircleX className="size-6" />
            </span>

            <h1 className="mt-4 text-xl font-bold tracking-tight">
              Booking not found
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {result.message ??
                "We couldn't find this booking. It may have been removed."}
            </p>

            <Link
              href="/dashboard/customer/my-rentals"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-6 h-10 gap-2 rounded-full border-border bg-background px-5 text-sm"
              )}
            >
              Back to My Rentals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const booking: TBookingData = result.data;

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/[0.07] via-background to-background">
      {/* Soft green shapes, like the rest of the public pages. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -right-24 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 size-72 rounded-full bg-primary/[0.06] blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <Link
          href={`/equipment/${booking.equipmentId}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "animate-fade-up h-10 w-fit gap-2 rounded-full border-border bg-background/80 px-4 text-sm font-medium shadow-sm backdrop-blur transition-all duration-200 hover:-translate-x-0.5 hover:border-primary/40 hover:text-primary"
          )}
        >
          <ArrowLeft className="size-4" />
          Back to Booking
        </Link>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div
            style={{ animationDelay: "60ms" }}
            className="animate-fade-up"
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Checkout
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Review your booking details and proceed to pay.
            </p>
          </div>

          <p
            style={{ animationDelay: "120ms" }}
            className="animate-fade-up inline-flex items-center gap-1.5 self-start text-xs font-medium text-muted-foreground sm:mt-2 sm:self-auto sm:text-sm"
          >
            <ShieldCheck className="size-4 shrink-0 text-primary" />
            Your payment is secure and encrypted
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_325px] lg:items-start">
          <BookingSummaryCard booking={booking} />

          <div
            style={{ animationDelay: "160ms" }}
            className="animate-fade-up lg:sticky lg:top-24"
          >
            <PayNowButton booking={booking} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
