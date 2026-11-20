import { TEquipmentForm } from "@/app/(dashboard)/_components/Owner/UpdateEquipmentDialog";
import { TEquipment } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const addEquipment = async (data: TEquipment) => {
  const res = await fetch(`${BASE_URL}/equipment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteEquipment = async (id: string) => {
  const response = await fetch(`${BASE_URL}/equipment/${id}`, {
    method: "DELETE",
  });

  return response.json();
};

export const updateEquipment = async (id: string, data: TEquipmentForm) => {
  const response = await fetch(`${BASE_URL}/equipment/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};
