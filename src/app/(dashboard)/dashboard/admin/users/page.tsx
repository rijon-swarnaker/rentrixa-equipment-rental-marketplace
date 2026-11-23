import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Leaf, UsersRound } from "lucide-react";

import UserRoleDropdown from "@/components/Admin/UserRoleDropdown";
import { normalizeUserRole, userRoleMeta } from "@/components/Admin/userRole";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUsers } from "@/lib/actions/better-auth-users";
import { cn } from "@/lib/utils";

const PER_PAGE = 6;

type TAdminUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  createdAt?: string | Date | null;
};

type AdminUsersPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

// "Nov 10, 2025" like the mockup.
function formatDate(value?: string | Date | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

// Used when the user has no profile image.
function getInitials(name?: string | null) {
  if (!name) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const AdminUserPage = async ({ searchParams }: AdminUsersPageProps) => {
  let users: TAdminUser[] = [];

  try {
    const result = await getUsers();
    users = Array.isArray(result?.users) ? (result.users as TAdminUser[]) : [];
  } catch {
    users = [];
  }

  // Simple pagination using the ?page= query string.
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const totalPages = Math.max(1, Math.ceil(users.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const pageUsers = users.slice(start, start + PER_PAGE);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      {/* Header */}
      <div className="animate-fade-up relative flex items-center gap-4 overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/[0.09] via-card to-primary/[0.04] p-5 shadow-sm sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-16 -right-10 size-48 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute -bottom-20 left-1/3 size-48 rounded-full bg-primary/[0.06] blur-3xl" />
        </div>

        <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 sm:size-16">
          <UsersRound className="size-7 sm:size-8" />
        </span>

        <div className="relative min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            All <span className="text-primary">Users</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage all registered users on the Rentrixa platform.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="relative ml-auto hidden items-center gap-2 lg:flex"
        >
          <Leaf className="size-16 rotate-12 fill-primary/15 text-primary/50" />
          <Leaf className="size-9 -rotate-6 fill-primary/10 text-primary/40" />
        </div>
      </div>

      {/* Table card */}
      <div
        style={{ animationDelay: "90ms" }}
        className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        {users.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UsersRound className="size-7" />
            </span>

            <h2 className="mt-4 text-lg font-semibold">No users found</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Registered users will appear here once they create an account.
            </p>
          </div>
        ) : (
          <>
            {/* On phones the table is wider than the screen, so tell the user to scroll. */}
            <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground xl:hidden">
              Scroll sideways to see all columns →
            </p>

            <Table className="min-w-[840px] text-xs sm:text-[13px]">
              <TableHeader>
                <TableRow className="border-b border-border bg-primary/[0.06] hover:bg-primary/[0.06]">
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Role
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 font-semibold">
                    Registration Date
                  </TableHead>
                  <TableHead className="h-auto px-2.5 py-3.5 text-center font-semibold">
                    Change Role
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageUsers.map((user) => {
                  const role = normalizeUserRole(user.role);
                  const roleMeta = userRoleMeta[role];
                  const RoleIcon = roleMeta.icon;

                  return (
                    <TableRow
                      key={user.id}
                      className="border-border/60 hover:bg-muted/40"
                    >
                      <TableCell className="px-2.5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name || "User"}
                                fill
                                unoptimized
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center bg-primary/10 text-xs font-semibold text-primary">
                                {getInitials(user.name)}
                              </div>
                            )}
                          </div>

                          <p className="max-w-40 truncate font-semibold">
                            {user.name || "—"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="px-2.5 py-3 whitespace-nowrap">
                        {user.email || "—"}
                      </TableCell>

                      <TableCell className="px-2.5 py-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "h-7 gap-1.5 rounded-full px-3 text-[11px] font-medium whitespace-nowrap sm:text-xs",
                            roleMeta.pill
                          )}
                        >
                          <RoleIcon className="size-3.5 shrink-0" />
                          {roleMeta.label}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-2.5 py-3 whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </TableCell>

                      <TableCell className="px-2.5 py-3">
                        <div className="flex items-center justify-center">
                          <UserRoleDropdown
                            userId={user.id}
                            userName={user.name || ""}
                            role={user.role}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Footer / pagination */}
            <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground sm:text-sm">
                Showing {start + 1}–{start + pageUsers.length} of {users.length}{" "}
                user{users.length === 1 ? "" : "s"}
              </p>

              <div className="flex items-center gap-1.5">
                <Link
                  href={`/dashboard/admin/users?page=${currentPage - 1}`}
                  aria-label="Previous page"
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted",
                    currentPage === 1 && "pointer-events-none opacity-40"
                  )}
                >
                  <ChevronLeft className="size-4" />
                </Link>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={`/dashboard/admin/users?page=${pageNumber}`}
                    aria-label={`Page ${pageNumber}`}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg border text-xs font-semibold transition-colors",
                      pageNumber === currentPage
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    {pageNumber}
                  </Link>
                ))}

                <Link
                  href={`/dashboard/admin/users?page=${currentPage + 1}`}
                  aria-label="Next page"
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted",
                    currentPage === totalPages && "pointer-events-none opacity-40"
                  )}
                >
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUserPage;
