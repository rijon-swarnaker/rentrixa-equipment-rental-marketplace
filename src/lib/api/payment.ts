const BASE_API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createCheckoutSession = async (
  payload: {
    bookingId: string;
    userEmail: string;
  }
) => {
  if (!BASE_API) {
    throw new Error("API URL is not configured");
  }

  const res = await fetch(`${BASE_API}/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.message || "Payment failed");
  }

  return result.url;
};