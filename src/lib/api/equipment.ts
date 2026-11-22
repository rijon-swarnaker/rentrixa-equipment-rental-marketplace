import type { TEquipment } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const allEquipment = async (query: string) => {
  if (!BASE_URL) {
    throw new Error("API URL is not configured.");
  }
  const response = await fetch(`${BASE_URL}/all-equipment?${query}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch equipment.");
  }
  return response.json();
};


export const myEquipment = async (email: string) => {

  console.log( BASE_URL, "BASE_URL");
  if (!BASE_URL) {
    throw new Error("API URL is not configured.");
  }

  const response = await fetch(
    `${BASE_URL}/my-equipment/${encodeURIComponent(email)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch equipment.");
  }

  return response.json();
};


// admin update equipment
export const updateEquipment = async (
  equipmentId: string,
  data: Partial<TEquipment>
) => {
  if (!BASE_URL) {
    throw new Error("API URL is not configured.");
  }

  const response = await fetch(`${BASE_URL}/equipment/${equipmentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.message || "Failed to update equipment.");
  }

  return response.json();
};

// admin delete equipment
export const deleteEquipment = async (equipmentId: string) => {
  if (!BASE_URL) {
    throw new Error("API URL is not configured.");
  }
  const response = await fetch(`${BASE_URL}/equipment/${equipmentId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete equipment.");
  }
  return response.json();
};
