
import { PackageOpen } from "lucide-react";

import AllEquipmentHeader from "@/components/AllEquipment/AllEquipmentHeader";
import EquipmentFilters, {
  TEquipmentFilters,
} from "@/components/AllEquipment/EquipmentFilters";
import EquipmentPagination from "@/components/AllEquipment/EquipmentPagination";

import { allEquipment } from "@/lib/api/equipment";
import { TEquipmentProps } from "@/types";
import EquipmentCard from "@/components/HomePage/EquipmentCard";

const PER_PAGE = 9;

type AllEquipmentPageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const AllEquipmentPage = async ({
  searchParams,
}: AllEquipmentPageProps) => {
  const params = await searchParams;

  const getParam = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : "";

  const filters: TEquipmentFilters = {
    search: getParam("search"),
    category: getParam("category") || "all",
    rentalType: getParam("rentalType") || "all",
    price: getParam("price") || "all",
    sort: getParam("sort") || "recent",
  };

  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (key !== "page" && typeof value === "string") {
      queryParams.set(key, value);
    }
  }

  const query = queryParams.toString();


  const equipments: TEquipmentProps[] = await allEquipment(query);

  const categorySource: TEquipmentProps[] =
    getParam("category") ||
    getParam("rentalType") ||
    getParam("price") ||
    getParam("search")
      ? await allEquipment("")
      : equipments;


  const page = Math.max(1, Number(getParam("page")) || 1);

  const totalPages = Math.max(
    1,
    Math.ceil(equipments.length / PER_PAGE)
  );

  const currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * PER_PAGE;

  const pageEquipments = equipments.slice(
    start,
    start + PER_PAGE
  );

  // Dynamic category options
  const categories = [
    ...new Set(
      categorySource
        .map((equipment) => equipment.category)
        .filter((category) => Boolean(category?.trim()))
    ),
  ].sort((a, b) => a.localeCompare(b));

  return (
    <div className="w-full">
      <AllEquipmentHeader />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Search and Filters */}
        <EquipmentFilters
          categories={categories}
          filters={filters}
        />

        {/* Equipment Listing */}
        {pageEquipments.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <PackageOpen className="size-10 text-muted-foreground" />

            <h2 className="mt-3 text-lg font-semibold">
              No equipment found
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageEquipments.map((equipment, index) => (
                <EquipmentCard
                  key={equipment._id}
                  equipment={equipment}
                  index={index}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground sm:text-sm">
                Showing {start + 1}–
                {start + pageEquipments.length} of{" "}
                {equipments.length} equipment
              </p>

              <EquipmentPagination
                currentPage={currentPage}
                totalPages={totalPages}
                query={query}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllEquipmentPage;
