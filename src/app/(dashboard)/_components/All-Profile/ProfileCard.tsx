
import {
  Camera,
  Crown,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface ProfileCardProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    phone?: string | null;
    address?: string | null;
    role?: string | null;
  };
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U"
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3.5 sm:gap-4 sm:p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border sm:size-11">
        <Icon className="size-4.5 sm:size-5" />
      </span>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-semibold break-words sm:text-base">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const name = user.name || "Unnamed user";
  const email = user.email || "Not provided";
  const phone = user.phone || "Not provided";
  const address = user.address || "Not provided";
  const role = user.role || "Customer";

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[300px_1fr] lg:gap-0 lg:p-8">

        {/* Left: Profile Information */}
        <div className="flex flex-col items-center text-center lg:border-r lg:border-border lg:pr-8">
          <div className="relative">
            <div className="rounded-full bg-gradient-to-br from-primary via-primary/80 to-emerald-400 p-[3px]">
              <Avatar className="size-32 border-2 border-card sm:size-36 lg:size-40">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={name}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-semibold">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <span className="absolute right-1 bottom-1 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-card">
              <Camera className="size-4" />
            </span>
          </div>

          <h2 className="mt-5 text-xl font-bold sm:text-2xl">
            {name}
          </h2>

          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Crown className="size-3.5" />
            {role}
          </span>

          <span className="mt-5 h-px w-full max-w-56 bg-border" />

          <p className="mt-4 max-w-56 text-sm leading-relaxed text-muted-foreground">
            Simplifying Equipment Rentals, Empowering Every Project.
          </p>
        </div>

        {/* Right: User Details */}
        <div className="space-y-3 lg:pl-8">
          <InfoRow icon={UserRound} label="Name" value={name} />
          <InfoRow icon={Mail} label="Email" value={email} />
          <InfoRow icon={Phone} label="Phone Number" value={phone} />
          <InfoRow icon={MapPin} label="Address" value={address} />
        </div>
      </div>
    </section>
  );
}
