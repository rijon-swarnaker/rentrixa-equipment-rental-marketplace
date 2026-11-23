
import { TEquipment } from "@/types";
import { authClient } from "../auth-client";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


// Get token
export const gettToken = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    console.log(error);
    throw new Error("Authentication token not found.");
  }

  return data.token;
};

// Update equipment
export const updateEquipment = async (
  equipmentId: string,
  data: Partial<TEquipment>
) => {
  if (!BASE_URL) {
    throw new Error("API URL is not configured.");
  }

  const token = await gettToken();

  const response = await fetch(`${BASE_URL}/equipment/${equipmentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.message || "Failed to update equipment.");
  }

  return response.json();
};

// Delete equipment
export const deleteEquipment = async (equipmentId: string) => {
  if (!BASE_URL) {
    throw new Error("API URL is not configured.");
  }

  const token = await gettToken();

  const response = await fetch(`${BASE_URL}/equipment/${equipmentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete equipment.");
  }

  return response.json();
};



// admin update user role

export const updateUserRole = async (
  userId: string,
  role: "customer" | "admin" | "owner",
) => {

  const token = await gettToken();
  
  try {
    const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(userId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to update the user role.");
    }

    return data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

