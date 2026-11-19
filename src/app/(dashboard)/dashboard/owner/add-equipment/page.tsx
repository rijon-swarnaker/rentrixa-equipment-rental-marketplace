import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { AddEquipmentForm } from "./add-equipment-form";




export default async function AddEquipmentPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <AddEquipmentForm
      owner={{
        name: session?.user.name || "Rijon Swamaker",
        email: session?.user.email || "rijonswamaker@gmail.com",
        image: session?.user.image ?? null,
      }}
    />
  );
}
