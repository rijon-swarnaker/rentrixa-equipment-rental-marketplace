import { TBookingProps } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;



export const bookEquipment = async (BookingEquipment: TBookingProps) => {
  if (!BASE_URL) {
    throw new Error("API URL is not configured.");
  }
  const response = await fetch(`${BASE_URL}/book-equipment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(BookingEquipment),
  });
  return response.json();
};


export const getBookingById = async (bookingId: string) => {
  if (!BASE_URL) {
    throw new Error("API URL is not configured.");
  }
  const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};