"use client";

import {
  BadgeDollarSign,
  CalendarClock,
  LayoutGrid,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import FilterSelect, { TFilterOption } from "./FilterSelect";

const RENTAL_TYPE_OPTIONS: TFilterOption[] = [
  { label: "All Rental Types", value: "all" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

// The API expects "min-max" (for example "2000-5000").
const PRICE_OPTIONS: TFilterOption[] = [
  { label: "All Prices", value: "all" },
  { label: "Under $2,000", value: "0-2000" },
  { label: "$2,000 - $5,000", value: "2000-5000" },
  { label: "$5,000 - $10,000", value: "5000-10000" },
  { label: "$10,000+", value: "10000-1000000" },
];

const SORT_OPTIONS: TFilterOption[] = [
  { label: "Recently Added", value: "recent" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

type EquipmentFiltersProps = {
  categories: string[];
};

const EquipmentFilters = ({ categories }: EquipmentFiltersProps) => {
  const categoryOptions: TFilterOption[] = [
    { label: "All Categories", value: "all" },
    ...categories.map((category) => ({
      label: category,
      value: category,
    })),
  ];

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="rounded-xl border border-border bg-card p-2.5 shadow-sm">
        <form
          role="search"
          // Search is not connected yet, so stop the page from reloading.
          onSubmit={(event) => event.preventDefault()}
          className="flex items-center gap-2"
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              name="search"
              aria-label="Search equipment"
              placeholder="Search by Equipment Name or Location..."
              className="h-10 w-full rounded-lg border border-border bg-background pr-3 pl-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </div>

          <Button
            type="submit"
            className="h-10 shrink-0 gap-2 rounded-lg px-4 sm:px-6"
          >
            <Search className="size-4" />
            Search
          </Button>
        </form>
      </div>

      {/* Dropdown filters + sort */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            ariaLabel="Filter by category"
            icon={LayoutGrid}
            defaultValue="all"
            options={categoryOptions}
          />

          <FilterSelect
            ariaLabel="Filter by rental type"
            icon={CalendarClock}
            defaultValue="all"
            options={RENTAL_TYPE_OPTIONS}
          />

          <FilterSelect
            ariaLabel="Filter by price range"
            icon={BadgeDollarSign}
            defaultValue="all"
            options={PRICE_OPTIONS}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs whitespace-nowrap text-muted-foreground sm:text-sm">
            Sort by:
          </span>

          <FilterSelect
            ariaLabel="Sort equipment"
            defaultValue="recent"
            options={SORT_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
};

export default EquipmentFilters;
