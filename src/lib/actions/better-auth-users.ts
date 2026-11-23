
import { headers } from "next/headers";
import { auth } from "../auth";

export const getUsers = async () => {
    const users = await auth.api.listUsers({
        query: {
            sortBy: "createdAt",
            sortDirection: "desc",
            limit: 100,
        },
        headers: await headers(),
    });
    return users;
}
