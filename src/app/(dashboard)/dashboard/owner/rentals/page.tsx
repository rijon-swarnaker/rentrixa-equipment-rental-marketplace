import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock3,
  Coins,
  ImageOff,
  Leaf,
  LogIn,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBookingsByOwnerEmail } from "@/lib/api/booking";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { TBookingData } from "@/types";

const PER_PAGE = 5;
const CURRENCY = "৳";

const paymentStyles = {
  paid: {
    label: "Paid",
    icon: CircleCheck,
    classes:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  pending: {
    label: "Pending",
    icon: Clock3,
    classes:
      "border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  failed: {
    label: "Failed",
    icon: CircleX,
    classes: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  },
  unpaid: {
    label: "Unpaid",
    icon: Clock3,
    classes: "border-border bg-muted text-muted-foreground",
  },
};

const bookingStyles = {
  approved: {
    label: "Confirmed",
    icon: CircleCheck,
    classes:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  pending: {
    label: "Pending",
    icon: Clock3,
    classes:
      "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  completed: {
    label: "Completed",
    icon: CircleCheck,
    classes:
      "border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  rejected: {
    label: "Cancelled",
    icon: CircleX,
    classes: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

type StatusBadgeProps = {
  label: string;
  icon: typeof CircleCheck;
  classes: string;
};

function StatusBadge({ label, icon: Icon, classes }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-7 gap-1.5 rounded-full px-3 text-[11px] font-medium whitespace-nowrap sm:text-xs",
        classes
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      {label}
    </Badge>
  );
}

// "Nov 25 –" on the first line and "Nov 28, 2026" on the second.
function formatDuration(startDate?: string, endDate?: string) {
  const start = new Date(startDate ?? "");
  const end = new Date(endDate ?? "");

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { start: "—", end: "" };
  }

  return {
    start: start.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    }),
    end: end.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  };
}

// Use the stored total when it exists, otherwise calculate it from the dates.
function getBookingAmount(booking: TBookingData) {
  if (
    typeof booking.totalAmount === "number" &&
    Number.isFinite(booking.totalAmount) &&
    booking.totalAmount > 0
  ) {
    return booking.totalAmount;
  }

  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);

  const days = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  );

  const units =
    booking.rentalType === "weekly"
      ? Math.ceil(days / 7)
      : booking.rentalType === "monthly"
        ? Math.ceil(days / 30)
        : days;

  return Number(booking.price) * (booking.quantity || 1) * units;
}

type OwnerRentalsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const RentalsPage = async ({ searchParams }: OwnerRentalsPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user?.email) {
    return (
      <div className="animate-fade-up mx-auto max-w-3xl rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LogIn className="size-6" />
        </span>

        <h1 className="mt-4 text-lg font-semibold">
          Please log in to view your equipment rentals.
        </h1>

        <Link
          href="/login"
          className={cn(
            buttonVariants(),
            "mt-5 h-10 gap-2 rounded-full px-5 text-sm"
          )}
        >
          Log in
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  let rentals: TBookingData[] = [];

  try {
    const data = await getBookingsByOwnerEmail(user.email);
    rentals = Array.isArray(data) ? data : [];
  } catch {
    rentals = [];
  }

  // Simple pagination using the ?page= query string.
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const totalPages = Math.max(1, Math.ceil(rentals.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const pageRentals = rentals.slice(start, start + PER_PAGE);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      {/* Header */}
      <div className="animate-fade-up relative flex items-center gap-4 overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/[0.09] via-card to-primary/[0.04] p-5 shadow-sm sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-16 -right-10 size-48 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute -bottom-20 left-1/3 size-48 rounded-full bg-primary/[0.06] blur-3xl" />
        </div>

        <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 sm:size-16">
          <CalendarDays className="size-7 sm:size-8" />
          <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border border-card bg-primary text-primary-foreground shadow-sm">
            <Coins className="size-3.5" />
          </span>
        </span>

        <div className="relative min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Equipment Rental
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Track all rental bookings for your equipment.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="relative ml-auto hidden items-center gap-2 lg:flex"
        >
          <Leaf className="size-16 rotate-12 fill-primary/15 text-primary/50" />
          <Leaf className="size-9 -rotate-6 fill-primary/10 text-primary/40" />
        </div>
      </div>

      {/* Table card */}
      <div
        style={{ animationDelay: "90ms" }}
        className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        {rentals.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CalendarDays className="size-7" />
            </span>

            <h2 className="mt-4 text-lg font-semibold">No rentals yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Bookings for your equipment will appear here once customers rent
              it.
            </p>
          </div>
        ) : (
          <>
            {/* On phones the table is wider than the screen, so tell the user to scroll. */}
            <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground xl:hidden">
              Scroll sideways to see all columns →
            </p>

            <Table className="min-w-[1000px] text-xs sm:text-[13px]">
              <TableHeader>
                <TableRow className="border-b border-border bg-primary/[0.06] hover:bg-primary/[0.06]">
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Customer Information
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Equipment Information
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Rental Duration
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 text-center font-semibold">
                    Required Quantity
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Booking Amount
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Payment Status
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Booking Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRentals.map((booking) => {
                  const payment =
                    paymentStyles[booking.paymentStatus] ?? paymentStyles.unpaid;
                  const bookingStatus =
                    bookingStyles[booking.bookingStatus] ?? bookingStyles.pending;
                  const duration = formatDuration(
                    booking.startDate,
                    booking.endDate
                  );

                  return (
                    <TableRow
                      key={booking._id}
                      className="border-border/60 hover:bg-muted/40"
                    >
                      <TableCell className="px-2.5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                            {booking.userImage ? (
                              <Image
                                src={booking.userImage}
                                alt={booking.userName}
                                fill
                                unoptimized
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-muted-foreground">
                                <UserRound className="size-4" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-36 truncate font-semibold">
                              {booking.userName || "—"}
                            </p>
                            <p className="mt-0.5 max-w-36 truncate text-xs text-muted-foreground">
                              {booking.userEmail || "—"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-2.5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            {booking.image ? (
                              <Image
                                src={booking.image}
                                alt={booking.name}
                                fill
                                unoptimized
                                sizes="44px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-muted-foreground">
                                <ImageOff className="size-4" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 whitespace-normal">
                            <p className="max-w-36 leading-snug font-semibold">
                              {booking.name}
                            </p>
                            <p className="mt-0.5 max-w-36 truncate text-xs text-muted-foreground">
                              {booking.brand}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-2.5 py-3">
                        <div className="flex items-start gap-2">
                          <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                          <div className="leading-snug whitespace-nowrap">
                            <p>{duration.start} –</p>
                            <p>{duration.end}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-2.5 py-3 text-center font-medium tabular-nums">
                        {booking.quantity || 1}
                      </TableCell>

                      <TableCell className="px-2.5 py-3 font-bold whitespace-nowrap text-foreground tabular-nums">
                        {CURRENCY}
                        {getBookingAmount(booking).toLocaleString("en-US")}
                      </TableCell>

                      <TableCell className="px-2.5 py-3">
                        <StatusBadge
                          label={payment.label}
                          icon={payment.icon}
                          classes={payment.classes}
                        />
                      </TableCell>

                      <TableCell className="px-2.5 py-3">
                        <StatusBadge
                          label={bookingStatus.label}
                          icon={bookingStatus.icon}
                          classes={bookingStatus.classes}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Footer / pagination */}
            <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground sm:text-sm">
                Showing {start + 1}–{start + pageRentals.length} of{" "}
                {rentals.length} rental{rentals.length === 1 ? "" : "s"}
              </p>

              <div className="flex items-center gap-1.5">
                <Link
                  href={`/dashboard/owner/rentals?page=${currentPage - 1}`}
                  aria-label="Previous page"
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted",
                    currentPage === 1 && "pointer-events-none opacity-40"
                  )}
                >
                  <ChevronLeft className="size-4" />
                </Link>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={`/dashboard/owner/rentals?page=${pageNumber}`}
                    aria-label={`Page ${pageNumber}`}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg border text-xs font-semibold transition-colors",
                      pageNumber === currentPage
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    {pageNumber}
                  </Link>
                ))}

                <Link
                  href={`/dashboard/owner/rentals?page=${currentPage + 1}`}
                  aria-label="Next page"
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted",
                    currentPage === totalPages && "pointer-events-none opacity-40"
                  )}
                >
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RentalsPage;
