"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "cn";

const STORAGE_KEY = "rentrixa:favorites";
const CHANGE_EVENT = "rentrixa:favorites-changed";

function readFavorites(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable (private mode) — the UI still works for the session.
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

type FavoriteButtonProps = {
  equipmentId: string;
  /** "icon" sits on top of the equipment image, "button" sits in the owner row. */
  variant?: "icon" | "button";
  className?: string;
};

const FavoriteButton = ({
  equipmentId,
  variant = "icon",
  className,
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Favorites live in localStorage, so the icon and the owner-row button
  // stay in sync through a custom event.
  useEffect(() => {
    const sync = () => setIsFavorite(readFavorites().includes(equipmentId));

    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [equipmentId]);

  const toggleFavorite = () => {
    const current = readFavorites();

    writeFavorites(
      current.includes(equipmentId)
        ? current.filter((id) => id !== equipmentId)
        : [...current, equipmentId]
    );
  };

  const label = isFavorite ? "Remove from favorites" : "Save to favorites";

  if (variant === "button") {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={toggleFavorite}
        aria-pressed={isFavorite}
        aria-label={label}
        className={cn(
          "h-10 w-full gap-2 rounded-xl border-primary/40 px-4 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/10 hover:text-primary active:scale-[0.98] sm:w-auto",
          className
        )}
      >
        <Heart
          className={cn(
            "size-4 transition-transform duration-200",
            isFavorite && "scale-110 fill-current"
          )}
        />
        {isFavorite ? "Remove from Favorites" : "Save to Favorites"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-pressed={isFavorite}
      aria-label={label}
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-all duration-200 hover:scale-110 active:scale-95",
        isFavorite ? "text-red-500" : "hover:text-red-500",
        className
      )}
    >
      <Heart
        className={cn(
          "size-5 transition-transform duration-200",
          isFavorite && "scale-110 fill-current"
        )}
      />
    </button>
  );
};

export default FavoriteButton;
