import { UserApiRequests } from "@/requests/user.request";
import { queryOptions } from "@tanstack/react-query";

export const userQueryOptions = (searchParams: string) =>
  queryOptions({
    queryKey: ["user", searchParams],
    queryFn: async ({ queryKey }) => {
      const [, searchParams] = queryKey;
      try {
        const res = await UserApiRequests.findAll(searchParams);
        return res.payload;
      } catch (error) {
        console.log("Error fetching users:", error);
        throw error;
      }
    },
  });
