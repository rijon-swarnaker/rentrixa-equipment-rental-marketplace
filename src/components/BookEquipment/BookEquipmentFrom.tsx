"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  CalendarRange,
  Loader2,
  MapPin,
  Minus,
  NotebookPen,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";

import type { TEquipmentProps } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { bookEquipment } from "@/lib/api/booking";

const CURRENCY = "৳";

const RENTAL_TYPES = [
  { value: "daily", label: "Daily", unit: "Day", icon: CalendarDays },
  { value: "weekly", label: "Weekly", unit: "Week", icon: CalendarRange },
  { value: "monthly", label: "Monthly", unit: "Month", icon: CalendarCheck2 },
] as const;

type RentalType = (typeof RENTAL_TYPES)[number]["value"];

const DAY_MS = 24 * 60 * 60 * 1000;

function parseDateValue(value: string) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatAmount(value: number) {
  return value.toLocaleString("en-US");
}

const BookEquipmentFormPage = ({
  equipment,
  defaultStartDate = "",
  defaultEndDate = "",
}: {
  equipment: TEquipmentProps;
  defaultStartDate?: string;
  defaultEndDate?: string;
}) => {
  const availableQuantity = Math.max(
    1,
    Number.parseInt(equipment.quantity, 10) || 1,
  );

  const pricePerUnit = Number(equipment.price) || 0;

  const [isOpen, setIsOpen] = useState(true);
  const [rentalType, setRentalType] = useState<RentalType>(
    equipment.rentalType ?? "daily",
  );

  // Defaults come from the server page, so there is nothing to sync after mount.
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [quantity, setQuantity] = useState(1);
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const duration = useMemo(() => {
    const unit = RENTAL_TYPES.find((type) => type.value === rentalType)!.unit;

    const start = parseDateValue(startDate);
    const end = parseDateValue(endDate);

    if (!start || !end || end < start) {
      return { value: 0, unit };
    }

    const days = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / DAY_MS),
    );

    const value =
      rentalType === "daily"
        ? days
        : rentalType === "weekly"
          ? Math.max(1, Math.ceil(days / 7))
          : Math.max(1, Math.round(days / 30));

    return { value, unit };
  }, [startDate, endDate, rentalType]);

  const total = pricePerUnit * quantity * duration.value;
  const invalidRange = duration.value === 0;
  const isOutOfStock = availableQuantity < 1;

  const decreaseQuantity = () =>
    setQuantity((current) => Math.max(1, current - 1));

  const increaseQuantity = () =>
    setQuantity((current) => Math.min(availableQuantity, current + 1));

  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const userName = user?.name ?? "";
  const userEmail = user?.email ?? "";
  const userImage = user?.image ?? null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending) {
      toast.info("Please wait, user information is loading.");
      return;
    }

    if (!user) {
      toast.error("Please login first to book equipment.");

      router.push(
        `/login?callbackURL=${encodeURIComponent(
          window.location.pathname + window.location.search,
        )}`,
      );

      return;
    }

    if (invalidRange) {
      toast.error("Please choose a valid rental period.");
      return;
    }

    if (!contact.trim()) {
      toast.error("Please add a contact number.");
      return;
    }

    if (!address.trim()) {
      toast.error("Please add a delivery address.");
      return;
    }

    if (quantity > availableQuantity) {
      toast.error("Requested quantity is not available.");
      return;
    }

    try {
      setIsSubmitting(true);

      const { _id, ...equipmentDetails } = equipment;
      const BookingEquipment = {
        ...equipmentDetails,
        equipmentId: _id,
        startDate,
        endDate,
        quantity,
        contact,
        address,
        notes,
        userName,
        userEmail,
        userImage,
        paymentStatus: "unpaid",
        bookingStatus: "pending",
        bookingDate: new Date().toISOString().split("T")[0],
      };

      console.log("Booking Data:", BookingEquipment);

      const result = await bookEquipment(BookingEquipment);

      if (!result.success) {
        throw new Error(result.message || "Booking request failed.");
      }

      toast.success("Booking request submitted successfully!");

      // Reset form
      setContact("");
      setAddress("");
      setNotes("");
      setQuantity(1);
    } catch (error) {
      console.error("Booking Error:", error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
        <p className="text-sm font-semibold">Ready to book {equipment.name}?</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Reopen the form to pick your dates and quantity.
        </p>

        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-4 h-10 w-full gap-2 rounded-xl"
        >
          <CalendarCheck2 className="size-4" />
          Book Equipment
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarCheck2 className="size-5" />
          </span>

          <h2 className="truncate text-lg font-bold tracking-tight">
            Book Equipment
          </h2>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Close booking form"
          onClick={() => setIsOpen(false)}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        {/* Rental type */}

        {/* Dates */}
        <div className="space-y-1.5">
          <Label htmlFor="rental-start-date">Rental Start Date</Label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="rental-start-date"
              type="date"
              required
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="h-10 pl-9 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 dark:[&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="rental-end-date">Rental End Date</Label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="rental-end-date"
              type="date"
              required
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              aria-invalid={invalidRange}
              className="h-10 pl-9 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 dark:[&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>

          {invalidRange && startDate && endDate && (
            <p className="text-xs text-destructive">
              The end date must be on or after the start date.
            </p>
          )}
        </div>

        {/* Quantity */}
        <div className="space-y-1.5">
          <Label id="required-quantity-label">
            Required Quantity
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              {availableQuantity} available
            </span>
          </Label>

          <div
            role="group"
            aria-labelledby="required-quantity-label"
            className="flex h-10 items-center justify-between rounded-lg border border-input px-1 dark:bg-input/30"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Decrease quantity"
              onClick={decreaseQuantity}
              disabled={quantity <= 1 || isOutOfStock}
              className="rounded-md"
            >
              <Minus className="size-4" />
            </Button>

            <span
              aria-live="polite"
              className="min-w-8 text-center text-sm font-semibold tabular-nums"
            >
              {quantity}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Increase quantity"
              onClick={increaseQuantity}
              disabled={quantity >= availableQuantity || isOutOfStock}
              className="rounded-md"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-1.5">
          <Label htmlFor="contact-number">Contact Number</Label>

          <div className="relative">
            <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="contact-number"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="+880 1700 000000"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              className="h-10 pl-9"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <Label htmlFor="delivery-address">Delivery Address</Label>

          <div className="relative">
            <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="delivery-address"
              type="text"
              autoComplete="street-address"
              required
              placeholder="House/Plot, Road, Area, City"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="h-10 pl-9"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label htmlFor="additional-notes">
            Additional Notes{" "}
            <span className="text-xs font-normal text-muted-foreground">
              (Optional)
            </span>
          </Label>

          <div className="relative">
            <NotebookPen className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Textarea
              id="additional-notes"
              rows={2}
              placeholder="Any special requirements..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-16 pl-9"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 divide-x divide-border rounded-xl border border-primary/15 bg-primary/5 px-1 py-3 dark:border-primary/25 dark:bg-primary/10">
          <div className="px-2 text-center">
            <p className="text-[0.7rem] leading-tight text-muted-foreground sm:text-xs">
              Rental Duration
            </p>
            <p className="mt-1 text-sm font-bold">
              {duration.value || 0} {duration.unit}
              {duration.value !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="px-2 text-center">
            <p className="text-[0.7rem] leading-tight text-muted-foreground sm:text-xs">
              Quantity
            </p>
            <p className="mt-1 text-sm font-bold">{quantity}</p>
          </div>

          <div className="px-2 text-center">
            <p className="text-[0.7rem] leading-tight text-muted-foreground sm:text-xs">
              Total Amount
            </p>
            <p className="mt-1 text-sm font-bold text-primary tabular-nums">
              {CURRENCY}
              {formatAmount(total)}
            </p>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || invalidRange || isOutOfStock}
          className="h-11 w-full gap-2 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 transition-transform duration-200 hover:-translate-y-0.5 disabled:translate-y-0"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CalendarCheck2 className="size-4" />
          )}
          {isSubmitting ? "Sending request..." : "Confirm Booking"}
          {!isSubmitting && <ArrowRight className="ml-auto size-4" />}
        </Button>

        <p className="text-center text-[0.7rem] leading-relaxed text-muted-foreground">
          No payment is taken online. The owner will confirm your request.
        </p>
      </div>
    </form>
  );
};

export default BookEquipmentFormPage;
