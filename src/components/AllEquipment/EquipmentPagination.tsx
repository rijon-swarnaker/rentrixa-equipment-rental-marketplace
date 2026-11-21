import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";

type EquipmentPaginationProps = {
  currentPage: number;
  totalPages: number;
  // Other URL filters (if any) are kept when moving between pages.
  query?: string;
};

const EquipmentPagination = ({
  currentPage,
  totalPages,
  query = "",
}: EquipmentPaginationProps) => {
  const hrefFor = (page: number) =>
    `/all-equipment?${query ? `${query}&` : ""}page=${page}`;

  return (
    <nav aria-label="Equipment pagination" className="flex items-center gap-1.5">
      <Link
        href={hrefFor(currentPage - 1)}
        aria-label="Previous page"
        className={cn(
          "flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted",
          currentPage === 1 && "pointer-events-none opacity-40"
        )}
      >
        <ChevronLeft className="size-4" />
      </Link>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (pageNumber) => (
          <Link
            key={pageNumber}
            href={hrefFor(pageNumber)}
            aria-label={`Page ${pageNumber}`}
            aria-current={pageNumber === currentPage ? "page" : undefined}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg border text-xs font-semibold transition-colors",
              pageNumber === currentPage
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-muted"
            )}
          >
            {pageNumber}
          </Link>
        )
      )}

      <Link
        href={hrefFor(currentPage + 1)}
        aria-label="Next page"
        className={cn(
          "flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted",
          currentPage === totalPages && "pointer-events-none opacity-40"
        )}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
};

export default EquipmentPagination;
