import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  CircleX,
  Clock3,
  Eye,
  Heart,
  ImageOff,
} from "lucide-react";

import RemoveFavoriteButton from "@/components/Favorites/RemoveFavoriteButton";
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
import { getUserFavorites } from "@/lib/api/favorites";
import { getUserBookings } from "@/lib/api/user";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { TBookingData } from "@/types";

const PER_PAGE = 5;
const CURRENCY = "৳";

export type TFavoriteProps = {
  _id: string;
  equipmentId: string;
  userEmail: string;
  userName: string;
  userImage: string;
  equipmentName: string;
  equipmentBrand: string;
  equipmentModel: string;
  equipmentImage: string;
  equipmentCondition: string;
  equipmentCategory: string;
  equipmentLocation: string;
  createdAt: string | Date;
};

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
  none: {
    label: "Not booked",
    icon: CircleHelp,
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

// Mirrors the total shown on the My Rentals page.
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

type FavoritesPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const FavoritesPage = async ({ searchParams }: FavoritesPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user?.email) {
    return (
      <div className="animate-fade-up mx-auto max-w-3xl rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Heart className="size-6" />
        </span>

        <h1 className="mt-4 text-lg font-semibold">
          Please log in to view your favorites.
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

  const [favoritesData, bookingsData] = await Promise.all([
    getUserFavorites(user.email),
    getUserBookings(user.email),
  ]);

  const favorites: TFavoriteProps[] = Array.isArray(favoritesData)
    ? favoritesData
    : [];
  const bookings: TBookingData[] = Array.isArray(bookingsData)
    ? bookingsData
    : [];

  // Favorites only store equipment, so match each one to its booking for the
  // rental dates, total and payment status shown in the table.
  const bookingByEquipment = new Map<string, TBookingData>();
  bookings.forEach((booking) => {
    if (!bookingByEquipment.has(booking.equipmentId)) {
      bookingByEquipment.set(booking.equipmentId, booking);
    }
  });

  // Simple pagination using the ?page= query string.
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const totalPages = Math.max(1, Math.ceil(favorites.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const pageFavorites = favorites.slice(start, start + PER_PAGE);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      {/* Header */}
      <div className="animate-fade-up relative flex items-center gap-4 overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/[0.08] via-card to-primary/[0.05] p-5 shadow-sm sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-16 -right-10 size-48 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute -bottom-20 left-1/3 size-48 rounded-full bg-primary/[0.06] blur-3xl" />
        </div>

        <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 sm:size-16">
          <Heart className="size-7 fill-current sm:size-8" />
        </span>

        <div className="relative min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Favorites
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Your favorite equipment collection
          </p>
        </div>

        <div
          aria-hidden="true"
          className="relative ml-auto hidden items-center gap-3 lg:flex"
        >
          <Heart className="size-14 fill-primary/20 text-primary/60" />
          <Heart className="size-6 rotate-12 fill-primary/15 text-primary/40" />
        </div>
      </div>

      {/* Table card */}
      <div
        style={{ animationDelay: "90ms" }}
        className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Heart className="size-7" />
            </span>

            <h2 className="mt-4 text-lg font-semibold">No favorites yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Browse equipment and tap the heart on any item to save it here.
            </p>

            <Link
              href="/all-equipment"
              className={cn(
                buttonVariants(),
                "mt-5 h-10 gap-2 rounded-full px-5 text-sm"
              )}
            >
              Browse Equipment
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <>
            <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground xl:hidden">
              Scroll sideways to see all columns →
            </p>

            <Table className="min-w-[980px] text-xs sm:text-[13px]">
              <TableHeader>
                <TableRow className="border-b border-border bg-primary/[0.06] hover:bg-primary/[0.06]">
                  <TableHead className="h-auto px-3 py-3.5 font-semibold">
                    Equipment Name
                  </TableHead>
                  <TableHead className="h-auto px-3 py-3.5 font-semibold">
                    Rental Start Date
                  </TableHead>
                  <TableHead className="h-auto px-3 py-3.5 font-semibold">
                    Rental End Date
                  </TableHead>
                  <TableHead className="h-auto px-3 py-3.5 font-semibold">
                    Booking Date
                  </TableHead>
                  <TableHead className="h-auto px-3 py-3.5 font-semibold">
                    Total Amount
                  </TableHead>
                  <TableHead className="h-auto px-3 py-3.5 font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="h-auto px-3 py-3.5 text-center font-semibold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageFavorites.map((favorite) => {
                  const booking =
                    bookingByEquipment.get(favorite.equipmentId) ?? null;
                  const payment = booking
                    ? paymentStyles[booking.paymentStatus] ?? paymentStyles.unpaid
                    : paymentStyles.none;

                  return (
                    <TableRow
                      key={favorite._id}
                      className="border-border/60 hover:bg-muted/40"
                    >
                      <TableCell className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            {favorite.equipmentImage ? (
                              <Image
                                src={favorite.equipmentImage}
                                alt={favorite.equipmentName}
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

                          <div className="min-w-0">
                            <p className="max-w-52 truncate font-semibold">
                              {favorite.equipmentName}
                            </p>
                            <p className="mt-0.5 max-w-52 truncate text-xs text-muted-foreground">
                              {favorite.equipmentBrand} -{" "}
                              {favorite.equipmentModel}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-3 py-3 whitespace-nowrap">
                        {formatDate(booking?.startDate)}
                      </TableCell>

                      <TableCell className="px-3 py-3 whitespace-nowrap">
                        {formatDate(booking?.endDate)}
                      </TableCell>

                      <TableCell className="px-3 py-3 whitespace-nowrap">
                        {formatDate(booking?.bookingDate)}
                      </TableCell>

                      <TableCell className="px-3 py-3 font-bold whitespace-nowrap text-primary tabular-nums">
                        {booking ? (
                          <>
                            {CURRENCY}
                            {getTotalAmount(booking).toLocaleString("en-US")}
                          </>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <StatusBadge
                          label={payment.label}
                          icon={payment.icon}
                          classes={payment.classes}
                        />
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/equipment/${favorite.equipmentId}`}
                            className={cn(
                              buttonVariants({ variant: "outline", size: "sm" }),
                              "h-8 gap-1.5 rounded-full border-primary/40 px-3 text-xs font-medium whitespace-nowrap text-primary hover:bg-primary/10 hover:text-primary"
                            )}
                          >
                            <Eye className="size-3.5" />
                            View Details
                          </Link>

                          <RemoveFavoriteButton
                            equipmentId={favorite.equipmentId}
                            equipmentName={favorite.equipmentName}
                            userEmail={user.email}
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
                Showing {start + 1}–{start + pageFavorites.length} of{" "}
                {favorites.length} favorite{favorites.length === 1 ? "" : "s"}
              </p>

              <div className="flex items-center gap-1.5">
                <Link
                  href={`/dashboard/customer/favorites?page=${currentPage - 1}`}
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
                    href={`/dashboard/customer/favorites?page=${pageNumber}`}
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
                  href={`/dashboard/customer/favorites?page=${currentPage + 1}`}
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

export default FavoritesPage;
