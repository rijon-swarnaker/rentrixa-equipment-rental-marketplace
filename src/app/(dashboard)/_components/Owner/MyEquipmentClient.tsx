
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Package,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Boxes,
  MapPin,
  CalendarDays,
  Loader2,
  RefreshCw,
  Home,
  AlertCircle,
  ImageOff,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { TEquipmentWithId } from "@/app/(dashboard)/dashboard/owner/my-equipment/page";
import type { TEquipment } from "@/types";

import { deleteEquipment } from "@/lib/actions/equipment";
import UpdateEquipmentDialog from "./UpdateEquipmentDialog";

type Props = {
  initialEquipment: TEquipmentWithId[];
  errorMessage?: string;
};

type TStatusConfig = {
  label: string;
  icon: LucideIcon;
  className: string;
};

type TEquipmentImageProps = {
  src?: string | null;
  alt: string;
  size: "small" | "large";
};

const PAGE_SIZE = 8;

const rentalTypeLabel: Record<TEquipment["rentalType"], string> = {
  daily: "day",
  weekly: "week",
  monthly: "month",
};

const statusConfig: Record<TEquipment["status"], TStatusConfig> = {
  pending: {
    label: "Pending",
    icon: Clock3,
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },

  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },

  rejected: {
    label: "Rejected",
    icon: XCircle,
    className:
      "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

// Validate image URL

const isValidImageSrc = (value?: string | null) => {
  const trimmed = value?.trim();

  if (!trimmed) return false;

  if (trimmed.startsWith("/")) return true;

  try {
    const url = new URL(trimmed);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
};

// Equipment Image Component

const EquipmentImage = ({
  src,
  alt,
  size,
}: TEquipmentImageProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const imageSrc = src?.trim() ?? "";

  const hasValidImage =
    isValidImageSrc(imageSrc) && failedSrc !== imageSrc;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-lg border border-border bg-muted ${
        size === "small" ? "size-12" : "size-16"
      }`}
    >
      {hasValidImage ? (
        <Image
          src={imageSrc}
          alt={alt || "Equipment"}
          fill
          unoptimized
          sizes={size === "small" ? "48px" : "64px"}
          className="object-cover"
          onError={() => setFailedSrc(imageSrc)}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <ImageOff
            className={size === "small" ? "size-5" : "size-6"}
          />
        </div>
      )}
    </div>
  );
};

// Main Component

const MyEquipmentClient = ({
  initialEquipment,
  errorMessage,
}: Props) => {
  const router = useRouter();

  // Equipment State

  const [equipment, setEquipment] =
    useState<TEquipmentWithId[]>(initialEquipment);

  const [currentPage, setCurrentPage] = useState(1);

  // Delete State

  const [selectedEquipment, setSelectedEquipment] =
    useState<TEquipmentWithId | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  // Update State

  const [editingEquipment, setEditingEquipment] =
    useState<TEquipmentWithId | null>(null);

  // Statistics

  const stats = useMemo(
    () => [
      {
        title: "Total Equipment",
        value: equipment.length,
        icon: Package,
        iconClass: "bg-primary/10 text-primary",
      },
      {
        title: "Pending",
        value: equipment.filter(
          (item) => item.status === "pending"
        ).length,
        icon: Clock3,
        iconClass:
          "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
      {
        title: "Approved",
        value: equipment.filter(
          (item) => item.status === "approved"
        ).length,
        icon: CheckCircle2,
        iconClass:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        title: "Rejected",
        value: equipment.filter(
          (item) => item.status === "rejected"
        ).length,
        icon: XCircle,
        iconClass:
          "bg-red-500/10 text-red-600 dark:text-red-400",
      },
    ],
    [equipment]
  );

  // Pagination

  const totalPages = Math.max(
    1,
    Math.ceil(equipment.length / PAGE_SIZE)
  );

  const paginatedEquipment = equipment.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Format Price

  const formatPrice = (price: string) => {
    const amount = Number(price);

    if (!Number.isFinite(amount)) {
      return price;
    }

    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const renderPrice = (item: TEquipment) => (
    <span className="whitespace-nowrap font-medium tabular-nums">
      ৳{formatPrice(item.price)}
      <span className="text-muted-foreground">
        {" "}
        / {rentalTypeLabel[item.rentalType]}
      </span>
    </span>
  );

  // Render Status

  const renderStatus = (status: TEquipment["status"]) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={`gap-1.5 whitespace-nowrap ${config.className}`}
      >
        <Icon className="size-3.5" />
        {config.label}
      </Badge>
    );
  };

  // Navigation

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  // Open Update Dialog

  const handleUpdate = (item: TEquipmentWithId) => {
    setEditingEquipment(item);
  };

  // Update Equipment in Local State

  const handleEquipmentUpdated = (
    updated: TEquipmentWithId
  ) => {
    setEquipment((previous) =>
      previous.map((item) =>
        item._id === updated._id ? updated : item
      )
    );
  };

  // Delete Equipment

  const handleDelete = async () => {
    if (!selectedEquipment || deletingId) return;

    const id = selectedEquipment._id;

    try {
      setDeletingId(id);

      const response = await deleteEquipment(id);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete equipment"
        );
      }

      const updatedEquipment = equipment.filter(
        (item) => item._id !== id
      );

      setEquipment(updatedEquipment);

      setCurrentPage((previous) =>
        Math.min(
          previous,
          Math.max(
            1,
            Math.ceil(updatedEquipment.length / PAGE_SIZE)
          )
        )
      );

      setSelectedEquipment(null);

      toast.success("Equipment deleted successfully.");

      router.refresh();
    } catch (error) {
      console.error("Delete Equipment Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete equipment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full min-w-0 bg-background text-foreground">
      <div className="@container mx-auto w-full min-w-0 max-w-[1600px]">
        <div className="min-w-0 space-y-5 p-4 sm:p-6 @4xl:space-y-6 @4xl:p-8">

          {/* Breadcrumb */}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
              onClick={() => handleNavigate("/dashboard")}
            >
              <Home className="mr-1 size-3.5" />
              Home
            </Button>

            <span>/</span>

            <span className="font-medium text-foreground">
              My Equipment
            </span>
          </div>

          {/* Page Header */}

          <div className="flex flex-col gap-4 @3xl:flex-row @3xl:items-center @3xl:justify-between">
            <div className="flex min-w-0 items-center gap-3 @lg:gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary @lg:size-14">
                <Package className="size-6 @lg:size-7" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight @lg:text-3xl">
                  My <span className="text-primary">Equipment</span>
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your added equipment and keep track of their rental
                  status.
                </p>
              </div>
            </div>

            <Button
              size="lg"
              className="h-11 w-full shrink-0 gap-2 @3xl:w-auto"
              onClick={() =>
                handleNavigate("/dashboard/owner/add-equipment")
              }
            >
              <Plus className="size-4" />
              Add Equipment
            </Button>
          </div>

          {/* Error State */}

          {errorMessage && (
            <div className="flex flex-col gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 @lg:flex-row @lg:items-center @lg:justify-between">
              <div className="flex min-w-0 items-center gap-2 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span className="min-w-0 break-words">
                  {errorMessage}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => router.refresh()}
              >
                <RefreshCw className="mr-2 size-4" />
                Try Again
              </Button>
            </div>
          )}

          {/* Statistics */}

          <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @4xl:grid-cols-4 @4xl:gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card
                  key={stat.title}
                  className="min-w-0 border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardContent className="flex items-center gap-3 p-4 @4xl:gap-4 @4xl:p-5">
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-full @4xl:size-12 ${stat.iconClass}`}
                    >
                      <Icon className="size-5 @4xl:size-6" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm text-muted-foreground">
                        {stat.title}
                      </p>

                      <p className="mt-0.5 text-2xl font-bold tabular-nums">
                        {stat.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Equipment Card */}

          <Card className="min-w-0 overflow-hidden border-border/70 bg-card shadow-sm">
            <CardHeader className="border-b border-border/70 px-4 py-4 @lg:px-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Boxes className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <CardTitle className="text-base font-semibold">
                      Your Equipment
                    </CardTitle>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      Manage and monitor your listed equipment
                    </p>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="shrink-0 whitespace-nowrap"
                >
                  {equipment.length} Items
                </Badge>
              </div>
            </CardHeader>

            {/* Desktop Table */}

            <div className="hidden overflow-x-auto @4xl:block">
              <Table className="min-w-[860px]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="h-12 pl-5">
                      Equipment Name
                    </TableHead>

                    <TableHead>Category</TableHead>
                    <TableHead>Rental Price</TableHead>
                    <TableHead>Available Quantity</TableHead>
                    <TableHead>Status</TableHead>

                    <TableHead className="pr-5 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedEquipment.map((item) => (
                    <TableRow key={item._id} className="group">

                      {/* Equipment Name */}

                      <TableCell className="py-3 pl-5">
                        <div className="flex min-w-[180px] items-center gap-3">
                          <EquipmentImage
                            src={item.image}
                            alt={item.name}
                            size="small"
                          />

                          <div className="min-w-0 max-w-[220px]">
                            <p className="truncate font-medium">
                              {item.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {item.brand} · {item.model}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="whitespace-nowrap font-normal"
                        >
                          {item.category}
                        </Badge>
                      </TableCell>

                      {/* Price */}

                      <TableCell>
                        {renderPrice(item)}
                      </TableCell>

                      {/* Quantity */}

                      <TableCell>
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                          <Package className="size-3.5" />
                          {item.quantity}
                        </div>
                      </TableCell>

                      {/* Status */}

                      <TableCell>
                        {renderStatus(item.status)}
                      </TableCell>

                      {/* Actions */}

                      <TableCell className="pr-5">
                        <div className="flex items-center justify-end gap-1.5">

                          {/* View */}

                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 px-2.5"
                            aria-label={`View ${item.name}`}
                            onClick={() =>
                              handleNavigate(
                                `/dashboard/owner/my-equipment/${item._id}`
                              )
                            }
                          >
                            <Eye className="size-3.5" />
                            <span className="hidden @6xl:inline">
                              View
                            </span>
                          </Button>

                          {/* Update */}

                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 px-2.5"
                            aria-label={`Update ${item.name}`}
                            onClick={() => handleUpdate(item)}
                          >
                            <Pencil className="size-3.5" />
                            <span className="hidden @6xl:inline">
                              Update
                            </span>
                          </Button>

                          {/* Delete */}

                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 border-destructive/20 px-2.5 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            aria-label={`Delete ${item.name}`}
                            disabled={deletingId === item._id}
                            onClick={() =>
                              setSelectedEquipment(item)
                            }
                          >
                            <Trash2 className="size-3.5" />
                            <span className="hidden @6xl:inline">
                              Delete
                            </span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile / Tablet Equipment Cards */}

            <div className="divide-y divide-border @4xl:hidden">
              {paginatedEquipment.map((item) => (
                <div
                  key={item._id}
                  className="space-y-4 p-4"
                >
                  <div className="flex items-start gap-3">
                    <EquipmentImage
                      src={item.image}
                      alt={item.name}
                      size="large"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold">
                        {item.name}
                      </h3>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {item.brand} · {item.model}
                      </p>

                      <p className="mt-1 text-sm text-primary">
                        {renderPrice(item)}
                      </p>

                      <div className="mt-2">
                        {renderStatus(item.status)}
                      </div>
                    </div>
                  </div>

                  {/* Equipment Information */}

                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div className="flex min-w-0 items-center gap-2">
                      <Boxes className="size-3.5 shrink-0" />
                      <span className="truncate">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-2">
                      <Package className="size-3.5 shrink-0" />
                      <span className="truncate">
                        {item.quantity} Available
                      </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-2">
                      <MapPin className="size-3.5 shrink-0" />
                      <span className="truncate">
                        {item.location}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-2">
                      <CalendarDays className="size-3.5 shrink-0" />
                      <span className="capitalize">
                        {item.rentalType}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="grid grid-cols-3 gap-2">

                    {/* View */}

                    <Button
                      variant="outline"
                      size="sm"
                      className="min-w-0 px-2"
                      onClick={() =>
                        handleNavigate(
                          `/dashboard/owner/my-equipment/${item._id}`
                        )
                      }
                    >
                      <Eye className="mr-1.5 size-3.5 shrink-0" />
                      View
                    </Button>

                    {/* Update */}

                    <Button
                      variant="outline"
                      size="sm"
                      className="min-w-0 px-2"
                      onClick={() => handleUpdate(item)}
                    >
                      <Pencil className="mr-1.5 size-3.5 shrink-0" />
                      Update
                    </Button>

                    {/* Delete */}

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deletingId === item._id}
                      className="min-w-0 border-destructive/20 px-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() =>
                        setSelectedEquipment(item)
                      }
                    >
                      <Trash2 className="mr-1.5 size-3.5 shrink-0" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}

            {equipment.length === 0 && !errorMessage && (
              <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
                  <Package className="size-7 text-muted-foreground" />
                </div>

                <h3 className="text-lg font-semibold">
                  No equipment found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  You have not added any equipment yet. Start by listing your
                  first equipment.
                </p>

                <Button
                  className="mt-5"
                  onClick={() =>
                    handleNavigate(
                      "/dashboard/owner/add-equipment"
                    )
                  }
                >
                  <Plus className="mr-2 size-4" />
                  Add Equipment
                </Button>
              </div>
            )}

            {/* Pagination */}

            {equipment.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-border/70 px-4 py-4 @lg:flex-row @lg:items-center @lg:justify-between @lg:px-5">
                <p className="text-xs text-muted-foreground @lg:text-sm">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(
                      currentPage * PAGE_SIZE,
                      equipment.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {equipment.length}
                  </span>{" "}
                  results
                </p>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1)
                      )
                    }
                  >
                    <ChevronLeft className="size-4" />
                    <span className="sr-only">
                      Previous page
                    </span>
                  </Button>

                  <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                    {currentPage}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                  >
                    <ChevronRight className="size-4" />
                    <span className="sr-only">
                      Next page
                    </span>
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Update Equipment Dialog */}

      {editingEquipment && (
        <UpdateEquipmentDialog
          key={editingEquipment._id}
          equipment={editingEquipment}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setEditingEquipment(null);
            }
          }}
          onUpdated={handleEquipmentUpdated}
        />
      )}

      {/* Delete Confirmation Dialog */}

      <AlertDialog
        open={!!selectedEquipment}
        onOpenChange={(open) => {
          if (!open && !deletingId) {
            setSelectedEquipment(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Equipment?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedEquipment?.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={!!deletingId}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyEquipmentClient;
