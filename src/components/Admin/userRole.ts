import { Crown, KeyRound, UserRound } from "lucide-react";

export const USER_ROLES = ["customer", "admin", "owner"] as const;

export type TUserRole = (typeof USER_ROLES)[number];

export const userRoleMeta = {
  customer: {
    label: "Customer",
    icon: UserRound,
    pill: "border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  admin: {
    label: "Admin",
    icon: Crown,
    pill: "border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-400",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  owner: {
    label: "Owner",
    icon: KeyRound,
    pill: "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
} satisfies Record<
  TUserRole,
  { label: string; icon: typeof UserRound; pill: string; iconColor: string }
>;

// The API stores lowercase roles, but this keeps "Admin" and "admin" working
// in case older data uses a different casing.
export function normalizeUserRole(value?: string | null): TUserRole {
  const role = value?.trim().toLowerCase();

  if (role === "admin" || role === "owner") {
    return role;
  }

  return "customer";
}
