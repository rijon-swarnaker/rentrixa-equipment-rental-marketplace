
"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { TEquipmentProps } from "@/types";
import { cn } from "cn";

type FavoriteButtonProps = {
  equipment: TEquipmentProps;
  variant?: "icon" | "button";
  className?: string;
};

const STORAGE_KEY = "rentrixa:favorites";
const CHANGE_EVENT = "rentrixa:favorites-changed";

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    console.error("LocalStorage unavailable");
  }
}

const FavoriteButton = ({
  equipment,
  variant = "icon",
  className,
}: FavoriteButtonProps) => {
  const { data: session, isPending } = useSession();

  const user = session?.user;

  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const equipmentId = equipment._id
    ? String(equipment._id)
    : "";

  useEffect(() => {
    if (!equipmentId) return;

    const sync = () => {
      setIsFavorite(readFavorites().includes(equipmentId));
    };

    sync();

    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [equipmentId]);

  const toggleFavorite = async () => {
    if (isLoading || isPending) return;

    if (!user?.email) {
      console.error("Please login first");
      return;
    }

    if (!equipmentId) {
      console.error("Equipment ID missing");
      return;
    }

    const current = readFavorites();
    const alreadyFavorite = current.includes(equipmentId);

    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/favorites`,
        {
          method: alreadyFavorite ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            equipmentId,
            userEmail: user.email,
            userName: user.name,
            userImage: user.image,

            equipmentName: equipment.name,
            equipmentBrand: equipment.brand,
            equipmentModel: equipment.model,
            equipmentImage: equipment.image,
            equipmentCondition: equipment.condition,
            equipmentCategory: equipment.category,
            equipmentLocation: equipment.location,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to update favorite"
        );
      }

      const updatedFavorites = alreadyFavorite
        ? current.filter((item) => item !== equipmentId)
        : [...current, equipmentId];

      writeFavorites(updatedFavorites);
      setIsFavorite(!alreadyFavorite);

    } catch (error) {
      console.error("Favorite Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const label = isFavorite
    ? "Remove from favorites"
    : "Add to favorites";

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={toggleFavorite}
        disabled={isLoading || isPending}
        className={cn(
          "flex items-center gap-2",
          className
        )}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Heart
            className={cn(
              "size-4",
              isFavorite && "fill-current text-red-500"
            )}
          />
        )}

        {isFavorite
          ? "Remove from Favorites"
          : "Add to Favorites"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={isLoading || isPending}
      aria-pressed={isFavorite}
      aria-label={label}
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-background/90 shadow-sm transition hover:scale-110",
        isFavorite
          ? "text-red-500"
          : "text-foreground hover:text-red-500",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <Heart
          className={cn(
            "size-5 transition-transform",
            isFavorite && "scale-110 fill-current"
          )}
        />
      )}
    </button>
  );
};

export default FavoriteButton;
