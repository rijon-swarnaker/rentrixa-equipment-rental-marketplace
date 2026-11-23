"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  normalizeUserRole,
  USER_ROLES,
  userRoleMeta,
  type TUserRole,
} from "@/components/Admin/userRole";

import { cn } from "@/lib/utils";
import { updateUserRole } from "@/lib/api/equipment-client";

type UserRoleDropdownProps = {
  userId: string;
  userName: string;
  role?: string | null;
};

const UserRoleDropdown = ({ userId, userName, role }: UserRoleDropdownProps) => {
  const router = useRouter();
  const [value, setValue] = useState<TUserRole>(normalizeUserRole(role));
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = async (next: string) => {
    const nextRole = normalizeUserRole(next);

    if (nextRole === value || isSaving) {
      return;
    }

    const previous = value;
    setValue(nextRole);
    setIsSaving(true);

    try {
      await updateUserRole(userId, nextRole);

      toast.success(
        `${userName || "User"} is now ${userRoleMeta[nextRole].label}.`
      );
      router.refresh();
    } catch (error) {
      setValue(previous);
      toast.error(
        error instanceof Error ? error.message : "Failed to update role."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next) {
          handleChange(next);
        }
      }}
      disabled={isSaving}
    >
      <SelectTrigger
        aria-label={`Change role for ${userName || "this user"}`}
        size="sm"
        className="h-9 w-[130px] justify-between rounded-full border-border bg-card px-3.5 text-xs font-medium shadow-none"
      >
        <SelectValue>
          {() => (
            <span className="flex items-center gap-1.5">
              {isSaving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : null}
              {userRoleMeta[value].label}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent align="end" className="min-w-[130px]">
        {USER_ROLES.map((roleOption) => {
          const item = userRoleMeta[roleOption];
          const Icon = item.icon;

          return (
            <SelectItem key={roleOption} value={roleOption}>
              <Icon className={cn("size-4", item.iconColor)} />
              {item.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default UserRoleDropdown;
