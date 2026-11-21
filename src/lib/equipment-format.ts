import { TEquipmentProps } from "@/types";

// Shared helpers so every equipment card shows prices the same way.
export const CURRENCY = "$";

export const RENTAL_TYPE_LABEL: Record<
  TEquipmentProps["rentalType"],
  string
> = {
  daily: "day",
  weekly: "week",
  monthly: "month",
};

export function formatPrice(price: string) {
  const amount = Number(price);

  return Number.isFinite(amount) ? amount.toLocaleString("en-US") : price;
}
