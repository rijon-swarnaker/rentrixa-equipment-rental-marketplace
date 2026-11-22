"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "rentrixa:favorites";
const CHANGE_EVENT = "rentrixa:favorites-changed";

type RemoveFavoriteButtonProps = {
  equipmentId: string;
  equipmentName: string;
  userEmail: string;
};

const RemoveFavoriteButton = ({
  equipmentId,
  equipmentName,
  userEmail,
}: RemoveFavoriteButtonProps) => {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  // Keep the heart on the equipment page in sync after removing it here.
  const syncLocalFavorites = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const ids = raw ? JSON.parse(raw) : [];

      if (Array.isArray(ids)) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(ids.filter((id) => id !== equipmentId))
        );
        window.dispatchEvent(new Event(CHANGE_EVENT));
      }
    } catch {
      // Local storage is optional; the server data is still updated.
    }
  };

  const handleRemove = async () => {
    if (isRemoving) {
      return;
    }

    setIsRemoving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/favorites`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ equipmentId, userEmail }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to remove favorite");
      }

      syncLocalFavorites();
      toast.success(`${equipmentName} removed from favorites.`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleRemove}
      disabled={isRemoving}
      aria-label={`Remove ${equipmentName} from favorites`}
      className="h-8 gap-1.5 rounded-full border-destructive/30 px-3 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      {isRemoving ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
      {isRemoving ? "Removing…" : "Remove"}
    </Button>
  );
};

export default RemoveFavoriteButton;
