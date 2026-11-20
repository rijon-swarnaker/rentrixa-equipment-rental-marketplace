
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const myEquipment = async (email: string) => {
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
