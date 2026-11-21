
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
