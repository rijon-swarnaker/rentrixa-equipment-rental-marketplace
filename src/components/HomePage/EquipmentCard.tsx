
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  HardHat,
  Heart,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";
import {
  CURRENCY,
  formatPrice,
  RENTAL_TYPE_LABEL,
} from "@/lib/equipment-format";
import { TEquipmentProps } from "@/types";

interface EquipmentCardProps {
  equipment: TEquipmentProps;
  index?: number;
}

const EquipmentCard = ({
  equipment,
  index = 0,
}: EquipmentCardProps) => {
  return (
    <article
      key={equipment._id}
      style={{ animationDelay: `${100 + index * 60}ms` }}
      className="group animate-fade-up flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
    >
      {/* Equipment Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {equipment.image?.trim() ? (
          <Image
            src={equipment.image}
            alt={equipment.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/15 via-muted to-muted">
            <HardHat className="size-10 text-primary/40" />
          </div>
        )}

        {/* Category Badge */}
        <span className="absolute left-2.5 top-2.5 inline-flex max-w-[70%] items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium text-foreground shadow-sm backdrop-blur sm:text-xs">
          <HardHat className="size-3 shrink-0 text-primary" />
          <span className="truncate">{equipment.category}</span>
        </span>

        {/* Favorite Button */}
        <button
          type="button"
          aria-label={`Save ${equipment.name} to favorites`}
          className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-all duration-200 hover:scale-110 hover:text-primary active:scale-95"
        >
          <Heart className="size-3.5" />
        </button>
      </div>

      {/* Equipment Details */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <h3 className="line-clamp-1 text-sm font-semibold leading-snug sm:text-base">
          {equipment.name}
        </h3>

        {/* Brand & Model */}
        <dl className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1">
            <dt className="text-muted-foreground">Brand:</dt>
            <dd className="font-medium">{equipment.brand}</dd>
          </div>

          <span
            aria-hidden="true"
            className="h-3 w-px bg-border"
          />

          <div className="flex items-center gap-1">
            <dt className="text-muted-foreground">Model:</dt>
            <dd className="font-medium">{equipment.model}</dd>
          </div>
        </dl>

        {/* Location */}
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{equipment.location}</span>
        </p>

        {/* Price & Details Button */}
        <div className="mt-auto">
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
            <p className="flex min-w-0 items-baseline gap-1 whitespace-nowrap">
              <span className="text-base font-bold leading-tight tracking-tight text-primary sm:text-lg">
                {CURRENCY}
                {formatPrice(equipment.price)}
              </span>

              <span className="text-[11px] text-muted-foreground sm:text-xs">
                / {RENTAL_TYPE_LABEL[equipment.rentalType]}
              </span>
            </p>

            <Link
              href={`/equipment/${equipment._id}`}
              className={cn(
                buttonVariants({ size: "sm" }),
                "h-7 shrink-0 gap-1 rounded-md px-2 text-[10px] shadow-sm sm:h-8 sm:px-3 sm:text-xs"
              )}
            >
              Details
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default EquipmentCard;
