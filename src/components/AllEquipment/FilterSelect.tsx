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
  value: string;
  options: TFilterOption[];
  icon?: LucideIcon;
  onValueChange?: (value: string) => void;
  className?: string;
};

const FilterSelect = ({
  ariaLabel,
  value,
  options,
  icon: Icon,
  onValueChange,
  className,
}: FilterSelectProps) => {
  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange?.(next ?? "")}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(
          "w-fit gap-1.5 rounded-lg border-border bg-background px-3 text-xs font-medium shadow-xs data-[size=default]:h-9 sm:text-sm",
          className
        )}
      >
        {Icon ? <Icon className="size-4 text-primary" /> : null}
        <SelectValue>
          {(selected: string) =>
            options.find((option) => option.value === selected)?.label ??
            options.find((option) => option.value === value)?.label
          }
        </SelectValue>
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
