import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LayoutGrid, Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

// The six categories shown in the section, in the order from the design.
// `photo` marks images that fill their frame instead of blending into the glow.
const CATEGORIES = [
  {
    name: "Construction Equipment",
    image: "/assets/Construction-Equipment.png",
  },
  {
    name: "Photography Equipment",
    image: "/assets/Photography-Equipment.png",
  },
  {
    name: "Vehicles & Transportation",
    image: "/assets/Vehicles&Transportation.png",
  },
  {
    name: "Agriculture Equipment",
    image: "/assets/Agriculture-Equipment.png",
  },
  {
    name: "Electronics",
    image: "/assets/Electronics.png",
  },
  {
    name: "Event Equipment",
    image: "/assets/Event-Equipment.png",
    photo: true,
  },
];

const PopularCategories = () => {
  return (
    <section
      id="categories"
      className="relative overflow-hidden bg-gradient-to-b from-background via-primary/[0.04] to-background py-16 sm:py-20 lg:py-24 dark:via-primary/[0.06]"
    >
      {/* Background decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl sm:size-96" />
        <div className="absolute -right-28 bottom-0 size-80 rounded-full bg-primary/[0.08] blur-3xl sm:size-[26rem]" />

        {/* Leaves in the page corners */}
        <Leaf className="absolute -top-6 -left-8 size-28 rotate-12 fill-primary/10 text-primary/20 sm:size-36" />
        <Leaf className="absolute top-16 right-8 hidden size-16 -rotate-12 fill-primary/10 text-primary/20 lg:block" />
        <Leaf className="absolute -right-8 -bottom-6 size-28 -rotate-12 fill-primary/10 text-primary/20 sm:size-36" />
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
              <LayoutGrid className="size-3.5 sm:size-4" />
              Categories
            </span>

            <span
              aria-hidden="true"
              className="h-px w-10 bg-gradient-to-l from-transparent to-primary/40 sm:w-20"
            />
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:mt-5 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Popular{" "}
            <span className="relative inline-block text-primary">
              Categories
              <svg
                aria-hidden="true"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                fill="none"
                className="absolute -bottom-2 left-0 h-2.5 w-full text-primary/50"
              >
                <path
                  d="M2 8C18 3 38 2 58 5c14 2 26 3 40 1"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm text-pretty text-muted-foreground sm:text-base">
            Explore our wide range of equipment categories for your needs.
          </p>
        </div>

        {/* Category Cards */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.name}
              href={`/all-equipment?category=${encodeURIComponent(category.name)}`}
              style={{ animationDelay: `${140 + index * 70}ms` }}
              className="group animate-fade-up flex flex-col overflow-hidden rounded-2xl border border-primary/15 bg-card p-2 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15 sm:p-2.5"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70">
                {/* Green glow behind the product */}
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 size-3/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-2xl transition-transform duration-500 group-hover:scale-125"
                />

                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 16vw"
                  className={cn(
                    "transition-transform duration-500 group-hover:scale-105",
                    category.photo
                      ? "object-cover"
                      : "object-contain p-1.5 mix-blend-multiply"
                  )}
                />

                {/* Arrow shown on hover */}
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 right-1.5 flex size-7 translate-y-1 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>

              <div className="flex min-h-[3.25rem] flex-1 items-center justify-center px-1 pt-3 pb-1 sm:min-h-[3.5rem]">
                <h3 className="text-xs leading-snug font-semibold text-balance sm:text-sm">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
