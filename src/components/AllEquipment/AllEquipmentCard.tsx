import Image from "next/image";
import Link from "next/link";
import { Eye, HardHat, MapPin } from "lucide-react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import {
  CURRENCY,
  formatPrice,
  RENTAL_TYPE_LABEL,
} from "@/lib/equipment-format";
import { TEquipmentProps } from "@/types";

type AllEquipmentCardProps = {
  equipment: TEquipmentProps;
  index?: number;
};

const AllEquipmentCard = ({
  equipment,
  index = 0,
}: AllEquipmentCardProps) => {
  return (
    <article
      style={{ animationDelay: `${100 + index * 60}ms` }}
      className="group animate-fade-up flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
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

        <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground shadow-sm sm:text-xs">
          <span className="size-1.5 rounded-full bg-primary-foreground" />
          Available
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold leading-snug sm:text-base">
            {equipment.name}
          </h3>

          <p className="shrink-0 whitespace-nowrap">
            <span className="text-base font-bold tracking-tight text-primary sm:text-lg">
              {CURRENCY}
              {formatPrice(equipment.price)}
            </span>
            <span className="text-[11px] text-muted-foreground sm:text-xs">
              /{RENTAL_TYPE_LABEL[equipment.rentalType]}
            </span>
          </p>
        </div>

        <p className="mt-1.5 line-clamp-1 text-[11px] text-muted-foreground sm:text-xs">
          {equipment.brand}
          <span className="px-1 text-border">•</span>
          {equipment.model}
        </p>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{equipment.location}</span>
        </p>

        <Link
          href={`/equipment/${equipment._id}`}
          className={cn(
            buttonVariants(),
            "mt-3 h-9 w-full gap-1.5 rounded-lg text-xs sm:text-sm"
          )}
        >
          <Eye className="size-4" />
          View Details
        </Link>
      </div>
    </article>
  );
};

export default AllEquipmentCard;
