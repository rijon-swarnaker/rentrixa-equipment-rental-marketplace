// import { headers } from "next/headers";
// import { auth } from "../auth";

// const BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// export const getUser = async () => {
//   const users = await auth.api.listUsers({
//     query: {
//       sortBy: "name", // The field to sort by.
//       sortDirection: "desc", // The direction to sort by.
//     },
//     // This endpoint requires session cookies.
//     headers: await headers(),
//   });
//   return users;
// };
