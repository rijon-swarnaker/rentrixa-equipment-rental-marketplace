"use client";

import { CircleCheck, CircleX, Clock3, Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const EQUIPMENT_STATUSES = ["approved", "pending", "rejected"] as const;

export type TEquipmentStatus = (typeof EQUIPMENT_STATUSES)[number];

export const equipmentStatusMeta = {
  approved: {
    label: "Approved",
    icon: CircleCheck,
    pill: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  pending: {
    label: "Pending",
    icon: Clock3,
    pill: "border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 dark:text-amber-400",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  rejected: {
    label: "Rejected",
    icon: CircleX,
    pill: "border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:text-red-400",
    iconColor: "text-red-600 dark:text-red-400",
  },
} satisfies Record<
  TEquipmentStatus,
  { label: string; icon: typeof CircleCheck; pill: string; iconColor: string }
>;

// The API stores lowercase values, but this keeps "Approved" and "approved"
// working in case older data uses a different casing.
export function normalizeEquipmentStatus(value?: string): TEquipmentStatus {
  const status = value?.trim().toLowerCase();

  if (status === "approved" || status === "rejected") {
    return status;
  }

  return "pending";
}

type StatusSelectProps = {
  value?: string;
  onChange: (value: TEquipmentStatus) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  ariaLabel?: string;
};

const StatusSelect = ({
  value,
  onChange,
  disabled = false,
  loading = false,
  className,
  ariaLabel = "Equipment status",
}: StatusSelectProps) => {
  const current = normalizeEquipmentStatus(value);
  const meta = equipmentStatusMeta[current];
  const CurrentIcon = meta.icon;

  return (
    <Select
      value={current}
      onValueChange={(next) => {
        if (next) {
          onChange(normalizeEquipmentStatus(next));
        }
      }}
      disabled={disabled || loading}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        size="sm"
        className={cn(
          "h-8 w-[130px] justify-between rounded-full pl-3 text-xs font-medium shadow-none",
          meta.pill,
          className
        )}
      >
        <SelectValue>
          {() => (
            <span className="flex items-center gap-1.5">
              {loading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CurrentIcon className="size-3.5" />
              )}
              {meta.label}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent align="start" className="min-w-[130px]">
        {EQUIPMENT_STATUSES.map((status) => {
          const item = equipmentStatusMeta[status];
          const Icon = item.icon;

          return (
            <SelectItem key={status} value={status}>
              <Icon className={cn("size-4", item.iconColor)} />
              {item.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
