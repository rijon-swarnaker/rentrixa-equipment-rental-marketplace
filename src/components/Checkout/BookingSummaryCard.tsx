import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import Image from "next/image";
import {
  CalendarCheck2,
  Coins,
  ImageOff,
  Info,
  MapPin,
  Percent,
  Tag,
  Tractor,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TBookingData } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const CURRENCY = "৳";

const RENTAL_UNIT: Record<TBookingData["rentalType"], string> = {
  daily: "day",
  weekly: "week",
  monthly: "month",
};

function formatAmount(value: number) {
  return Number.isFinite(value) ? value.toLocaleString("en-US") : "0";
}

// 2026-11-22 -> 11/22/2026 (same format as the checkout design).
function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US");
}

// The end date is included, so 11/22 - 11/24 counts as 3 days.
function getDuration(booking: TBookingData) {
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return { count: 1, unit: "day" as const };
  }

  const days = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1
  );

  if (booking.rentalType === "weekly") {
    return { count: Math.max(1, Math.ceil(days / 7)), unit: "week" as const };
  }

  if (booking.rentalType === "monthly") {
    return { count: Math.max(1, Math.ceil(days / 30)), unit: "month" as const };
  }

  return { count: days, unit: "day" as const };
}

function DetailRow({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <p className="text-sm leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

const BookingSummaryCard = ({ booking }: { booking: TBookingData }) => {


  const price = Number(booking.price) || 0;
  const quantity = booking.quantity || 1;
  const total = booking.totalAmount;

  const rentalUnit = RENTAL_UNIT[booking.rentalType] ?? "day";

  return (
    <Card className="animate-fade-up rounded-2xl border border-border/70 shadow-sm [--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CalendarCheck2 className="size-5" />
          </span>

          <CardTitle
            role="heading"
            aria-level={2}
            className="text-lg font-bold tracking-tight sm:text-xl"
          >
            Booking Summary
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Equipment + booking details */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted sm:w-[230px] lg:w-[250px]">
            {booking.image ? (
              <Image
                src={booking.image}
                alt={booking.name}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 250px"
                className="object-contain"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <ImageOff className="size-8" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold tracking-tight sm:text-xl">
              {booking.name}
            </h3>

            <div className="mt-3 space-y-2.5">
              <DetailRow icon={Tag}>
                <span className="font-semibold">Brand:</span> {booking.brand}
                <span className="mx-1.5 text-border">|</span>
                <span className="font-semibold">Model:</span> {booking.model}
              </DetailRow>

              <DetailRow icon={CalendarCheck2}>
                <span className="font-semibold">Rental Date:</span>{" "}
                {formatDate(booking.startDate)} – {formatDate(booking.endDate)}{" "}
                
              </DetailRow>

              <DetailRow icon={MapPin}>
                <span className="font-semibold">Location:</span>{" "}
                {booking.location}
              </DetailRow>
            </div>
          </div>
        </div>

        <Separator />

        {/* Quantity + rental price */}
        <div className="grid gap-4 sm:grid-cols-2 sm:divide-x sm:divide-border">
          <div className="flex items-center gap-3">
            <Tractor className="size-6 shrink-0 text-primary" />

            <div>
              <p className="text-sm text-muted-foreground">Quantity</p>
              <p className="mt-0.5 text-lg font-bold">{quantity}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:pl-6">
            <Coins className="size-6 shrink-0 text-primary" />

            <div>
              <p className="text-sm text-muted-foreground">Rental Price</p>
              <p className="mt-0.5 text-lg font-bold">
                {CURRENCY}
                {formatAmount(price)}{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  / {rentalUnit}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between gap-4 rounded-xl border border-primary/15 bg-primary/[0.07] p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Percent className="size-4" />
            </span>

            <div>
              <p className="text-sm font-semibold">Total Rental Amount</p>
             
            </div>
          </div>

          <p className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            {CURRENCY}
            {formatAmount(total)}
          </p>
        </div>
      </CardContent>

      <CardContent className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        Service fee may be added at payment step
      </CardContent>
    </Card>
  );
};

export default BookingSummaryCard;
