import MyEquipmentClient from "@/app/(dashboard)/_components/Owner/MyEquipmentClient";
import { myEquipment } from "@/lib/api/equipment";
import { auth } from "@/lib/auth";
import { TEquipment } from "@/types";
import { headers } from "next/headers";

export type TEquipmentWithId = TEquipment & {
  _id: string;
};

const MyEquipmentPage = async () => {
  let equipment: TEquipmentWithId[] = [];
  let errorMessage = "";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user?.email) {
    throw new Error("User email not found in session");
  }

  try {
    const response = await myEquipment(user.email);

    equipment = Array.isArray(response) ? response : (response?.data ?? []);
  } catch (error) {
    console.error("My Equipment Fetch Error:", error);

    errorMessage = "Unable to load your equipment. Please try again.";
  }

  return (
    <MyEquipmentClient
      initialEquipment={equipment}
      errorMessage={errorMessage}
    />
  );
};

export default MyEquipmentPage;
