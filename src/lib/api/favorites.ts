export const getUserFavorites = async (userEmail: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/favorites/${encodeURIComponent(userEmail)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }

  const result = await response.json();

  // The API returns the array directly, but keep support for { data: [...] }.
  return Array.isArray(result) ? result : (result.data ?? []);
};