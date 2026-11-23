import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Cog,
  Drill,
  ImageOff,
  Leaf,
  PackageOpen,
} from "lucide-react";

import DeleteEquipmentButton from "@/components/Admin/DeleteEquipmentButton";
import EquipmentStatusDropdown from "@/components/Admin/EquipmentStatusDropdown";
import UpdateEquipmentButton from "@/components/Admin/UpdateEquipmentButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TEquipment } from "@/types";
import { getToken } from "@/lib/api/equipment";
import { redirect } from "next/navigation";



const PER_PAGE = 5;

type TAdminEquipment = TEquipment & {
  _id: string;
};

type AllEquipmentPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const AllEquipmentPage = async ({ searchParams }: AllEquipmentPageProps) => {
  let equipment: TAdminEquipment[] = [];

  const token = await getToken()

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/equipment`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store"
      }, 
       
    );


    if (response.status === 403) {
      redirect("/unauthorized");
    }

    if (response.ok) {
      const data = await response.json();
      equipment = Array.isArray(data) ? data : [];
    }
  } catch {
    equipment = [];
  }

  // Simple pagination using the ?page= query string.
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const totalPages = Math.max(1, Math.ceil(equipment.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const pageEquipment = equipment.slice(start, start + PER_PAGE);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      {/* Header */}
      <div className="animate-fade-up relative flex items-center gap-4 overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/[0.09] via-card to-primary/[0.04] p-5 shadow-sm sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-16 -right-10 size-48 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute -bottom-20 left-1/3 size-48 rounded-full bg-primary/[0.06] blur-3xl" />
        </div>

        <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 sm:size-16">
          <ClipboardCheck className="size-7 sm:size-8" />
        </span>

        <div className="relative min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            All <span className="text-primary">Equipment</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage all equipment items in the platform.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="relative ml-auto hidden items-center gap-3 lg:flex"
        >
          <Leaf className="size-12 rotate-12 fill-primary/15 text-primary/50" />
          <Cog className="size-9 text-primary/40" />
          <Drill className="size-12 -rotate-6 text-primary/50" />
          <BadgeCheck className="size-11 fill-primary/10 text-primary/60" />
        </div>
      </div>

      {/* Table card */}
      <div
        style={{ animationDelay: "90ms" }}
        className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        {equipment.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PackageOpen className="size-7" />
            </span>

            <h2 className="mt-4 text-lg font-semibold">No equipment found</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Equipment added by owners will appear here for review.
            </p>
          </div>
        ) : (
          <>
            {/* On phones the table is wider than the screen, so tell the user to scroll. */}
            <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground xl:hidden">
              Scroll sideways to see all columns →
            </p>

            <Table className="min-w-[1040px] text-xs sm:text-[13px]">
              <TableHeader>
                <TableRow className="border-b border-border bg-primary/[0.06] hover:bg-primary/[0.06]">
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Image
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Equipment Name
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Brand
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Model
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Category
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Location
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 text-center font-semibold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageEquipment.map((item) => (
                  <TableRow
                    key={item._id}
                    className="border-border/60 hover:bg-muted/40"
                  >
                    <TableCell className="px-2.5 py-3">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            unoptimized
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-muted-foreground">
                            <ImageOff className="size-5" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="px-2.5 py-3 whitespace-normal">
                      <p className="max-w-[170px] leading-snug font-semibold">
                        {item.name}
                      </p>
                    </TableCell>

                    <TableCell className="px-2.5 py-3">
                      {item.brand || "—"}
                    </TableCell>

                    <TableCell className="px-2.5 py-3">
                      {item.model || "—"}
                    </TableCell>

                    <TableCell className="px-2.5 py-3 whitespace-normal">
                      <p className="max-w-32 leading-snug">
                        {item.category || "—"}
                      </p>
                    </TableCell>

                    <TableCell className="px-2.5 py-3 whitespace-normal">
                      <p className="max-w-36 leading-snug">
                        {item.location || "—"}
                      </p>
                    </TableCell>

                    <TableCell className="px-2.5 py-3">
                      <EquipmentStatusDropdown
                        equipmentId={item._id}
                        equipmentName={item.name}
                        status={item.status}
                      />
                    </TableCell>

                    <TableCell className="px-2.5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <UpdateEquipmentButton equipment={item} />
                        <DeleteEquipmentButton
                          equipmentId={item._id}
                          equipmentName={item.name}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Footer / pagination */}
            <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground sm:text-sm">
                Showing {start + 1}–{start + pageEquipment.length} of{" "}
                {equipment.length} equipment
              </p>

              <div className="flex items-center gap-1.5">
                <Link
                  href={`/dashboard/admin/equipment?page=${currentPage - 1}`}
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
                    href={`/dashboard/admin/equipment?page=${pageNumber}`}
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
                  href={`/dashboard/admin/equipment?page=${currentPage + 1}`}
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

export default AllEquipmentPage;
