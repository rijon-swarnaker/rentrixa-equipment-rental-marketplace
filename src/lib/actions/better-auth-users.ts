
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "../auth";

export const getUsers = async () => {
  const requestHeaders = await headers();

  // Check authentication
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/login");
  }

  // Check authorization
  if (session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  // Get users
  const users = await auth.api.listUsers({
    query: {
      sortBy: "createdAt",
      sortDirection: "desc",
      limit: 100,
    },
    headers: requestHeaders,
  });

  return users;
};
