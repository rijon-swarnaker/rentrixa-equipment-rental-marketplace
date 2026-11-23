import { TEquipmentForm } from "@/app/(dashboard)/_components/Owner/UpdateEquipmentDialog";
import { TEquipment } from "@/types";
import { gettToken } from "../api/equipment-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const addEquipment = async (data: TEquipment) => {

  const token = await gettToken();
  const res = await fetch(`${BASE_URL}/equipment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteEquipment = async (id: string) => {
  const token = await gettToken();
  const response = await fetch(`${BASE_URL}/equipment/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const updateEquipment = async (id: string, data: TEquipmentForm) => {
  const token = await gettToken();
  const response = await fetch(`${BASE_URL}/equipment/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response;
};
