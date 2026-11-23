// import { headers } from "next/headers";
// import { auth } from "../auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const getUserBookings = async (userEmail: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/user-bookings/${encodeURIComponent(userEmail)}`,
      { cache: "no-store" },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
};


export const getEquipmentBookings = async () => {
  try {
    const response = await fetch(`${BASE_URL}/equipment-bookings`, {
      cache: "no-store",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching equipment bookings:", error);
    throw error;
  }
}

