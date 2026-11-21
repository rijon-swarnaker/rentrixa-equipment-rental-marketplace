"use client";

import type { LucideIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "cn";

export type TFilterOption = {
  label: string;
  value: string;
};

type FilterSelectProps = {
  ariaLabel: string;
  defaultValue: string;
  options: TFilterOption[];
  icon?: LucideIcon;
  // Leave this out while the filter is not wired up yet.
  onValueChange?: (value: string) => void;
  className?: string;
};

const FilterSelect = ({
  ariaLabel,
  defaultValue,
  options,
  icon: Icon,
  onValueChange,
  className,
}: FilterSelectProps) => {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value) => onValueChange?.(value ?? "")}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(
          "w-fit gap-1.5 rounded-lg border-border bg-background px-3 text-xs font-medium shadow-xs data-[size=default]:h-9 sm:text-sm",
          className
        )}
      >
        {Icon ? <Icon className="size-4 text-primary" /> : null}
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterSelect;
