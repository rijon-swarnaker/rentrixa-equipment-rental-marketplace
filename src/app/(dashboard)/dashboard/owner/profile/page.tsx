
import { redirect } from "next/navigation";
import Link from "next/link";
import { House, Users } from "lucide-react";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import EditProfileButton from "@/app/(dashboard)/_components/All-Profile/EditProfileButton";
import ProfileCard from "@/app/(dashboard)/_components/All-Profile/ProfileCard";

export const metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Protect profile page
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 sm:space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/dashboard"
              aria-label="Dashboard"
              className="inline-flex transition-colors hover:text-foreground"
            >
              <House className="size-4" />
            </Link>
          </li>

          <li aria-hidden="true">/</li>

          <li className="font-medium text-foreground">Profile</li>
        </ol>
      </nav>

      {/* Page Header */}
<div className="flex items-center justify-between gap-3">
  {/* Title */}
  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 via-primary/10 to-transparent text-primary ring-1 ring-primary/20 sm:size-14 sm:rounded-2xl">
      <Users className="size-6 sm:size-7" />
    </span>

    <div className="min-w-0">
      <h1 className="text-xl font-bold tracking-tight sm:text-3xl">
        My <span className="text-primary">Profile</span>
      </h1>

      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
        View and manage your profile information.
      </p>

      <span className="mt-2 block h-1 w-10 rounded-full bg-primary" />
    </div>
  </div>

  {/* Edit Profile Button */}
  <div className="shrink-0">
    <EditProfileButton user={user} />
  </div>
</div>

      {/* Profile Information */}
      <ProfileCard user={user} />
    </div>
  );
}
