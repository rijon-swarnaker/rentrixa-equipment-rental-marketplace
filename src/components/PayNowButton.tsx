"use client";

import { createCheckoutSession } from "@/lib/api/payment";
import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, CreditCard } from "lucide-react";
import { TBookingData } from "@/types";

export default function PayNowButton({ booking }: { booking: TBookingData }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const url = await createCheckoutSession({
        bookingId: booking._id,
        userEmail: booking.userEmail,
      });

      window.location.assign(url);
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Payment failed");

      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-3 shadow-sm">
      <Button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className="h-12 w-full justify-between rounded-xl px-5 text-base font-semibold shadow-sm shadow-primary/20 transition-transform hover:-translate-y-0.5"
      >
        <span className="flex items-center gap-2">
          <CreditCard className="size-5" />
          {loading ? "Please wait..." : "Pay Now"}
        </span>
        <ArrowRight className="size-5" />
      </Button>
    </div>
  );
}
