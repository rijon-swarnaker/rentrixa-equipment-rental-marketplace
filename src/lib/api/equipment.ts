import { headers } from "next/headers";
import { auth } from "../auth";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// jwt token
// export const getToken = async () => {
//   const jwtToken = await auth.api.getToken({
//     headers: await headers(),
//   });
//   if (!jwtToken) {
//     throw new Error("User is not authenticated.");
//   }
//   const token = jwtToken.token;
//   return token;
// }


// const jwtToken = await auth.api.getToken({
//     headers: await headers(),
//   });
//   const token = jwtToken.token;
//   if (!jwtToken) {
//     throw new Error("User is not authenticated.");
//   }


export async function getToken(){
  const {token} = await auth.api.getToken({
    headers: await headers(),
  });
  if (!token) {
    throw new Error("User is not authenticated.");
  }
  return token;
}

export const allEquipment = async (query: string) => {

  
  
  const response = await fetch(`${BASE_URL}/all-equipment?${query}`, {
    headers: {
      "content-type": "application/json",

    },
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
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch equipment.");
  }

  return response.json();
};









