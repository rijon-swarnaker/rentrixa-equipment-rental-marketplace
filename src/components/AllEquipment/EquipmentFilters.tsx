"use client";

import type { FormEvent } from "react";

import { useRouter } from "next/navigation";
import {
  BadgeDollarSign,
  CalendarClock,
  LayoutGrid,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import FilterSelect, { TFilterOption } from "./FilterSelect";

export type TEquipmentFilters = {
  search: string;
  category: string;
  rentalType: string;
  price: string;
  sort: string;
};

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
  filters: TEquipmentFilters;
};

const EquipmentFilters = ({
  categories,
  filters,
}: EquipmentFiltersProps) => {
  const router = useRouter();

  // Every control writes to the URL. The server reads it and fetches again.
  const goWith = (params: URLSearchParams) => {
    params.delete("page"); // changing a filter starts on page 1

    const query = params.toString();
    router.push(query ? `/all-equipment?${query}` : "/all-equipment");
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = String(
      new FormData(event.currentTarget).get("search") ?? ""
    ).trim();

    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    goWith(params);
  };

  const updateFilter = (
    key: keyof TEquipmentFilters,
    value: string,
    emptyValue = "all"
  ) => {
    const params = new URLSearchParams(window.location.search);

    if (value && value !== emptyValue) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    goWith(params);
  };

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
          onSubmit={handleSearch}
          className="flex items-center gap-2"
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              name="search"
              aria-label="Search equipment"
              defaultValue={filters.search}
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
            value={filters.category}
            options={categoryOptions}
            onValueChange={(value) => updateFilter("category", value)}
          />

          <FilterSelect
            ariaLabel="Filter by rental type"
            icon={CalendarClock}
            value={filters.rentalType}
            options={RENTAL_TYPE_OPTIONS}
            onValueChange={(value) => updateFilter("rentalType", value)}
          />

          <FilterSelect
            ariaLabel="Filter by price range"
            icon={BadgeDollarSign}
            value={filters.price}
            options={PRICE_OPTIONS}
            onValueChange={(value) => updateFilter("price", value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs whitespace-nowrap text-muted-foreground sm:text-sm">
            Sort by:
          </span>

          <FilterSelect
            ariaLabel="Sort equipment"
            value={filters.sort}
            options={SORT_OPTIONS}
            onValueChange={(value) => updateFilter("sort", value, "recent")}
          />
        </div>
      </div>
    </div>
  );
};

export default EquipmentFilters;
