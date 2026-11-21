
import { Star } from "lucide-react";

import { TEquipmentProps } from "@/types";
import EquipmentCard from "./EquipmentCard";

const FeaturedEquipment = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured!");
  }

  const response = await fetch(
    `${baseUrl}/approved-equipment/limit`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch approved equipment!");
  }

  const equipments: TEquipmentProps[] = await response.json();

  if (!equipments.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-20 lg:py-24 dark:from-primary/[0.06]">
      {/* Background Shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl sm:size-96" />
        <div className="absolute top-16 -right-28 size-80 rounded-full bg-primary/[0.08] blur-3xl sm:size-[26rem]" />
        <div className="absolute -bottom-32 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl sm:size-96" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="animate-fade-up text-center">
          <div className="flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-10 bg-gradient-to-r from-transparent to-primary/40 sm:w-20"
            />

            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm sm:text-sm">
              <Star className="size-3.5 fill-current sm:size-4" />
              Top Rated Equipment
            </span>

            <span
              aria-hidden="true"
              className="h-px w-10 bg-gradient-to-l from-transparent to-primary/40 sm:w-20"
            />
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:mt-5 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Featured{" "}
            <span className="text-primary">Equipment</span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-pretty text-muted-foreground sm:text-base">
            Find the best rental equipment for your project,
            trusted by thousands of customers.
          </p>
        </div>

        {/* Equipment Cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {equipments.map((equipment, index) => (
            <EquipmentCard
              key={equipment._id}
              equipment={equipment}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEquipment;
