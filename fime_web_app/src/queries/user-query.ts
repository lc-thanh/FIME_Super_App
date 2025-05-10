import { UserApiRequests } from "@/requests/user.request";
import { queryOptions } from "@tanstack/react-query";

export const USERS_QUERY_KEY = "users";

export const usersQueryOptions = (searchParams: string) =>
  queryOptions({
    queryKey: [USERS_QUERY_KEY, searchParams],
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

export const USER_QUERY_KEY = "user";

export const userQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: [USER_QUERY_KEY, userId],
    queryFn: async ({ queryKey }) => {
      const [, userId] = queryKey;
      try {
        const res = await UserApiRequests.findOne(userId);
        return res.payload.data;
      } catch (error) {
        console.log("Error fetching user:", error);
        throw error;
      }
    },
  });
