import Image from "next/image";
import Link from "next/link";
import {
  Boxes,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  ClipboardList,
  Clock3,
  Eye,
  ImageOff,
  UserRound,
} from "lucide-react";

import DeleteBookingButton from "@/components/Admin/DeleteBookingButton";
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
import { cn } from "@/lib/utils";
import type { TBookingData } from "@/types";
import { getToken } from "@/lib/api/equipment";

const PER_PAGE = 5;
const CURRENCY = "৳";

const paymentStyles = {
  paid: {
    label: "Paid",
    icon: CircleCheck,
    classes:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  pending: {
    label: "Pending",
    icon: Clock3,
    classes:
      "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
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
        "h-6 gap-1.5 rounded-full px-2.5 text-[11px] font-medium whitespace-nowrap sm:text-xs",
        classes
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      {label}
    </Badge>
  );
}

// "2026-11-16" -> "Nov 16, 2026"
function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

// Matches the totals shown on My Rentals, so both views agree.
function getTotalAmount(booking: TBookingData) {
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

type AllRentalsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const AdminRentalsPage = async ({ searchParams }: AllRentalsPageProps) => {
  let rentals: TBookingData[] = [];

  const token = await getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/equipment-bookings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store" }
    );

    if (response.ok) {
      const data = await response.json();
      rentals = Array.isArray(data) ? data : [];
    }
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
      <div className="animate-fade-up relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-primary/10 blur-2xl"
        />

        <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 sm:size-16">
          <ClipboardList className="size-7 sm:size-8" />
        </span>

        <div className="relative min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            All <span className="text-primary">Rentals</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage every rental booking made on Rentrixa.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="relative ml-auto hidden items-center gap-3 lg:flex"
        >
          <span className="flex size-16 rotate-6 items-center justify-center rounded-2xl bg-primary/10 text-primary/70">
            <CalendarDays className="size-9" />
          </span>
          <span className="flex size-12 -rotate-6 items-center justify-center rounded-xl bg-primary/[0.07] text-primary/60">
            <Boxes className="size-7" />
          </span>
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
              <ClipboardList className="size-7" />
            </span>

            <h2 className="mt-4 text-lg font-semibold">No rentals found</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Customer bookings will appear here as soon as equipment is rented.
            </p>
          </div>
        ) : (
          <>
            {/* On phones the table is wider than the screen, so tell the user to scroll. */}
            <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground xl:hidden">
              Scroll sideways to see all columns →
            </p>

            <Table className="min-w-[1050px] text-xs sm:text-[13px]">
              <TableHeader>
                <TableRow className="border-b border-border bg-primary/[0.06] hover:bg-primary/[0.06]">
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Equipment Name
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Renter
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Start Date
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    End Date
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Booked On
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Total
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 text-center font-semibold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRentals.map((booking) => {
                  const payment =
                    paymentStyles[booking.paymentStatus] ?? paymentStyles.unpaid;

                  return (
                    <TableRow
                      key={booking._id}
                      className="border-border/60 hover:bg-muted/40"
                    >
                      <TableCell className="px-2.5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            {booking.image ? (
                              <Image
                                src={booking.image}
                                alt={booking.name}
                                fill
                                unoptimized
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-muted-foreground">
                                <ImageOff className="size-4" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-40 truncate font-semibold">
                              {booking.name}
                            </p>
                            <p className="mt-0.5 max-w-40 truncate text-xs text-muted-foreground">
                              {booking.brand} • {booking.model}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-2.5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                            {booking.userImage ? (
                              <Image
                                src={booking.userImage}
                                alt={booking.userName}
                                fill
                                unoptimized
                                sizes="32px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-muted-foreground">
                                <UserRound className="size-3.5" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-32 truncate font-medium">
                              {booking.userName || "—"}
                            </p>
                            <p className="mt-0.5 max-w-32 truncate text-xs text-muted-foreground">
                              {booking.userEmail || "—"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-2.5 py-3 whitespace-nowrap">
                        {formatDate(booking.startDate)}
                      </TableCell>

                      <TableCell className="px-2.5 py-3 whitespace-nowrap">
                        {formatDate(booking.endDate)}
                      </TableCell>

                      <TableCell className="px-2.5 py-3 whitespace-nowrap">
                        {formatDate(booking.bookingDate)}
                      </TableCell>

                      <TableCell className="px-2.5 py-3 font-bold whitespace-nowrap text-primary tabular-nums">
                        {CURRENCY}
                        {getTotalAmount(booking).toLocaleString("en-US")}
                      </TableCell>

                      <TableCell className="px-2.5 py-3">
                        <StatusBadge
                          label={payment.label}
                          icon={payment.icon}
                          classes={payment.classes}
                        />
                      </TableCell>

                      <TableCell className="px-2.5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/equipment/${booking.equipmentId}`}
                            className={cn(
                              buttonVariants({ variant: "outline", size: "sm" }),
                              "h-8 gap-1.5 rounded-full border-primary/40 px-3 text-xs font-medium whitespace-nowrap text-primary hover:bg-primary/10 hover:text-primary"
                            )}
                          >
                            <Eye className="size-3.5" />
                            View Details
                          </Link>

                          <DeleteBookingButton
                            bookingId={booking._id}
                            equipmentName={booking.name}
                            renterName={booking.userName || "this customer"}
                          />
                        </div>
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
                  href={`/dashboard/admin/rentals?page=${currentPage - 1}`}
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
                    href={`/dashboard/admin/rentals?page=${pageNumber}`}
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
                  href={`/dashboard/admin/rentals?page=${currentPage + 1}`}
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

export default AdminRentalsPage;
