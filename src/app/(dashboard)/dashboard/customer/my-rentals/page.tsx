import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import {
  CalendarCheck2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CirclePlay,
  CircleX,
  Clock3,
  Drill,
  Eye,
  ImageOff,
} from "lucide-react";

import { getUserBookings } from "@/lib/api/user";
import { auth } from "@/lib/auth";
import { TBookingData } from "@/types";
import { cn } from "cn";

const PER_PAGE = 5;
const CURRENCY = "৳";

// Payment badge styles
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

// Booking badge styles
const bookingStyles = {
  upcoming: {
    label: "Upcoming",
    icon: Clock3,
    classes:
      "border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  active: {
    label: "Active",
    icon: CirclePlay,
    classes: "border-primary/25 bg-primary/10 text-primary",
  },
  completed: {
    label: "Completed",
    icon: CircleCheck,
    classes:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    icon: CircleX,
    classes: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

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

// The API stores the price for one unit, so the total depends on the dates.
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

// Decide which of the four badges a booking should show.
function getBookingState(booking: TBookingData) {
  if (booking.bookingStatus === "rejected") {
    return "cancelled" as const;
  }

  if (booking.bookingStatus === "pending") {
    return "upcoming" as const;
  }

  const end = new Date(booking.endDate);

  if (!Number.isNaN(end.getTime()) && end < new Date()) {
    return "completed" as const;
  }

  return "active" as const;
}

function StatusBadge({
  label,
  icon: Icon,
  classes,
}: {
  label: string;
  icon: typeof CircleCheck;
  classes: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        classes
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      {label}
    </span>
  );
}

function EquipmentThumb({
  src,
  name,
  className,
}: {
  src?: string;
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative size-11 shrink-0 overflow-hidden rounded-lg border border-border bg-muted",
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          unoptimized
          sizes="56px"
          className="object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <ImageOff className="size-4" />
        </div>
      )}
    </div>
  );
}

type MyRentalsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const MyRentalsPage = async ({ searchParams }: MyRentalsPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user?.email) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <h1 className="text-lg font-semibold">
          Please log in to view your rentals.
        </h1>
      </div>
    );
  }

  const data = await getUserBookings(user.email);
  const rentals: TBookingData[] = Array.isArray(data) ? data : [];

  // Simple pagination using the ?page= query string.
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const totalPages = Math.max(1, Math.ceil(rentals.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const pageRentals = rentals.slice(start, start + PER_PAGE);

  // Work out both badges once so the table code stays short.
  const rows = pageRentals.map((booking) => ({
    booking,
    payment: paymentStyles[booking.paymentStatus ?? "unpaid"],
    bookingStatus: bookingStyles[getBookingState(booking)],
  }));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      {/* Header */}
      <div className="animate-fade-up relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-primary/10 blur-2xl"
        />

        <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 sm:size-16">
          <CalendarCheck2 className="size-7 sm:size-8" />
        </span>

        <div className="relative min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My <span className="text-primary">Rentals</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Track and manage all your rental bookings here.
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
            <Drill className="size-7" />
          </span>
        </div>
      </div>

      {/* Table card */}
      <div
        style={{ animationDelay: "90ms" }}
        className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        {rentals.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No rentals found.
          </p>
        ) : (
          <>
            {/* On phones the table is wider than the screen, so tell the user to scroll. */}
            <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground xl:hidden">
              Scroll sideways to see all columns →
            </p>

            {/* Table (scrolls sideways on small screens) */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-xs sm:text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-primary/[0.06]">
                    <th className="px-3 py-3.5 font-semibold">
                      Equipment Name
                    </th>
                    <th className="px-3 py-3.5 font-semibold whitespace-nowrap">
                      Rental Start Date
                    </th>
                    <th className="px-3 py-3.5 font-semibold whitespace-nowrap">
                      Rental End Date
                    </th>
                    <th className="px-3 py-3.5 font-semibold whitespace-nowrap">
                      Booking Date
                    </th>
                    <th className="px-3 py-3.5 font-semibold whitespace-nowrap">
                      Total Amount
                    </th>
                    <th className="px-3 py-3.5 font-semibold whitespace-nowrap">
                      Payment Status
                    </th>
                    <th className="px-3 py-3.5 font-semibold whitespace-nowrap">
                      Booking Status
                    </th>
                    <th className="px-3 py-3.5 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map(({ booking, payment, bookingStatus }) => (
                    <tr
                      key={booking._id}
                      className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-3">
                          <EquipmentThumb
                            src={booking.image}
                            name={booking.name}
                          />

                          <div className="min-w-0">
                            <p className="max-w-44 truncate font-semibold">
                              {booking.name}
                            </p>
                            <p className="mt-0.5 max-w-44 truncate text-xs text-muted-foreground">
                              {booking.brand} • {booking.model}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3.5 whitespace-nowrap">
                        {formatDate(booking.startDate)}
                      </td>

                      <td className="px-3 py-3.5 whitespace-nowrap">
                        {formatDate(booking.endDate)}
                      </td>

                      <td className="px-3 py-3.5 whitespace-nowrap">
                        {formatDate(booking.bookingDate)}
                      </td>

                      <td className="px-3 py-3.5 font-bold whitespace-nowrap text-primary tabular-nums">
                        {CURRENCY}
                        {getTotalAmount(booking).toLocaleString("en-US")}
                      </td>

                      <td className="px-3 py-3.5">
                        <StatusBadge
                          label={payment.label}
                          icon={payment.icon}
                          classes={payment.classes}
                        />
                      </td>

                      <td className="px-3 py-3.5">
                        <StatusBadge
                          label={bookingStatus.label}
                          icon={bookingStatus.icon}
                          classes={bookingStatus.classes}
                        />
                      </td>

                      <td className="px-3 py-3.5 text-center">
                        <Link
                          href={`/equipment/${booking.equipmentId}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-primary transition-colors hover:bg-primary/10"
                        >
                          <Eye className="size-3.5" />
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer / pagination */}
            <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground sm:text-sm">
                Showing {start + 1}–{start + pageRentals.length} of{" "}
                {rentals.length} rental{rentals.length === 1 ? "" : "s"}
              </p>

              <div className="flex items-center gap-1.5">
                <Link
                  href={`/dashboard/customer/my-rentals?page=${currentPage - 1}`}
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
                    href={`/dashboard/customer/my-rentals?page=${pageNumber}`}
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
                  href={`/dashboard/customer/my-rentals?page=${currentPage + 1}`}
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

export default MyRentalsPage;
