"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { gettToken } from "@/lib/api/equipment-client";

type DeleteBookingButtonProps = {
  bookingId: string;
  equipmentName: string;
  renterName: string;
};

const DeleteBookingButton = ({
  bookingId,
  equipmentName,
  renterName,
}: DeleteBookingButtonProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    const token = await gettToken();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/${bookingId}`,
        { 
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "DELETE" }
      );

      const result = await response.json();
      if (response.status === 403) {
    router.push("/unauthorized");
    return;
  }

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete booking");
      }

      toast.success(`${equipmentName} booking deleted.`);
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${equipmentName} booking by ${renterName}`}
        title="Delete booking"
        className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-3.5" />
      </Button>

      <AlertDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!isDeleting) {
            setOpen(nextOpen);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this rental?</AlertDialogTitle>

            <AlertDialogDescription>
              The booking of <strong>{equipmentName}</strong> by{" "}
              <strong>{renterName}</strong> will be removed permanently. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
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
    </>
  );
};

export default DeleteBookingButton;
