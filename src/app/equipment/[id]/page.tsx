import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  CircleDollarSign,
  HardHat,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import BookEquipmentFormPage from "@/components/BookEquipment/BookEquipmentFrom";
import BackToEquipment from "@/components/EquipmentDetails/BackToEquipment";
import FavoriteButton from "@/components/EquipmentDetails/FavoriteButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TEquipmentProps } from "@/types";

type EquipmentDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const CURRENCY = "৳";

const RENTAL_UNIT: Record<TEquipmentProps["rentalType"], string> = {
  daily: "day",
  weekly: "week",
  monthly: "month",
};

const DEFAULT_TERMS = [
  "Equipment must be returned in good condition.",
  "Any damage will be charged as per policy.",
  "Late return may incur additional charges.",
  "Please follow all safety instructions.",
];

function formatAmount(value: string) {
  const amount = Number(value);

  return Number.isFinite(amount) ? amount.toLocaleString("en-US") : value;
}

// yyyy-mm-dd for <input type="date">.
function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "O"
  );
}

// Deduped between generateMetadata and the page itself.
const getEquipment = cache(
  async (id: string): Promise<TEquipmentProps | null> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
    }

    const response = await fetch(
      `${apiUrl}/equipment/${encodeURIComponent(id)}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  }
);

export async function generateMetadata({
  params,
}: EquipmentDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const equipment = await getEquipment(id);

  if (!equipment) {
    return { title: "Equipment not found | Rentrixa" };
  }

  return {
    title: `${equipment.name} | Rentrixa`,
    description: equipment.description,
  };
}

// One of the four quick-fact tiles under the description.
function FeatureCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-primary/15 bg-primary/[0.06] p-3 dark:border-primary/25 dark:bg-primary/10">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>

      <div className="min-w-0">
        <p className="text-[0.7rem] leading-tight text-muted-foreground sm:text-xs">
          {label}
        </p>
        <p className="mt-1 text-sm leading-snug font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}

const EquipmentDetailsPage = async ({ params }: EquipmentDetailsPageProps) => {
  const { id } = await params;
  const equipment = await getEquipment(id);

  if (!equipment) {
    notFound();
  }

  const availableQuantity = Number(equipment.quantity) || 0;

  // The owner may have written rental terms as one paragraph or one per line.
  const customTerms =
    equipment.rentalTerms
      ?.split(/\r?\n/)
      .map((term) => term.trim())
      .filter(Boolean) ?? [];

  const terms = customTerms.length ? customTerms : DEFAULT_TERMS;

  // Default booking window: today → two days from now.
  const defaultStart = new Date();
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setDate(defaultEnd.getDate() + 2);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background dark:from-primary/[0.07]">
      {/* Soft background shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl sm:size-96" />
        <div className="absolute top-32 -right-28 size-80 rounded-full bg-primary/[0.08] blur-3xl sm:size-[26rem]" />
        <div className="absolute -bottom-32 left-1/3 size-72 rounded-full bg-primary/[0.06] blur-3xl sm:size-96" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="animate-fade-up">
          <BackToEquipment />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-8">
          {/* Image */}
          <div
            style={{ animationDelay: "60ms" }}
            className="animate-fade-up relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:col-start-1 lg:row-start-1"
          >
            <div className="relative aspect-[16/10] w-full sm:aspect-[2.1/1] lg:aspect-[2.2/1]">
              {equipment.image?.trim() ? (
                <Image
                  src={equipment.image}
                  alt={equipment.name}
                  fill
                  unoptimized
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/15 via-muted to-muted">
                  <HardHat className="size-14 text-primary/50" />
                </div>
              )}

              {/* Category pill */}
              <span className="absolute top-3 left-3 inline-flex max-w-[70%] items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur sm:text-sm">
                <Tag className="size-3.5 shrink-0 text-primary" />
                <span className="truncate">{equipment.category}</span>
              </span>

              {/* Favorite */}
              <div className="absolute top-3 right-3">
                <FavoriteButton equipmentId={equipment._id} />
              </div>
            </div>
          </div>

          {/* Details */}
          <div
            style={{ animationDelay: "140ms" }}
            className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:col-start-1 lg:row-start-2"
          >
            <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              {equipment.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Brand:</span>{" "}
                <span className="font-semibold">{equipment.brand}</span>
              </p>

              <span aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />

              <p>
                <span className="text-muted-foreground">Model:</span>{" "}
                <span className="font-semibold">{equipment.model}</span>
              </p>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {equipment.description || "No description provided."}
            </p>

            {/* Quick facts */}
            <div className="mt-5 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 xl:grid-cols-4">
              <FeatureCard
                icon={Tag}
                label="Category"
                value={equipment.category}
              />
              <FeatureCard
                icon={CircleDollarSign}
                label="Rental Price"
                value={`${CURRENCY}${formatAmount(equipment.price)} / ${
                  RENTAL_UNIT[equipment.rentalType] ?? "day"
                }`}
              />
              <FeatureCard
                icon={MapPin}
                label="Location"
                value={equipment.location}
              />
              <FeatureCard
                icon={Package}
                label="Available Quantity"
                value={String(availableQuantity)}
              />
            </div>
          </div>

          {/* Booking form */}
          <div
            style={{ animationDelay: "220ms" }}
            className="animate-fade-up self-start lg:sticky lg:top-24 lg:col-start-2 lg:row-span-4 lg:row-start-1"
          >
            <BookEquipmentFormPage
              equipment={equipment}
              defaultStartDate={formatDateValue(defaultStart)}
              defaultEndDate={formatDateValue(defaultEnd)}
            />
          </div>

          {/* Owner */}
          <div
            style={{ animationDelay: "300ms" }}
            className="animate-fade-up flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5 lg:col-start-1 lg:row-start-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="size-12 shrink-0 ring-2 ring-primary/20">
                <AvatarImage
                  src={equipment.ownerImage ?? undefined}
                  alt={equipment.ownerName}
                  className="object-cover"
                />
                <AvatarFallback className="text-sm font-semibold">
                  {getInitials(equipment.ownerName)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Owner</p>
                <p className="truncate text-sm font-semibold sm:text-base">
                  {equipment.ownerName}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="size-3.5 shrink-0" />
                  <span className="truncate">{equipment.ownerEmail}</span>
                </p>
              </div>
            </div>

            <FavoriteButton
              equipmentId={equipment._id}
              variant="button"
              className="shrink-0"
            />
          </div>

          {/* Rental terms */}
          <div
            style={{ animationDelay: "380ms" }}
            className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-start-1 lg:row-start-4"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 shrink-0 text-primary" />
              <h2 className="text-base font-semibold">
                Rental Terms and Conditions
              </h2>
            </div>

            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {terms.map((term) => (
                <li
                  key={term}
                  className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentDetailsPage;
