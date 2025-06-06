import { UserApiRequests } from "@/requests/user.request";
import { queryOptions } from "@tanstack/react-query";

export const USER_TABLE_QUERY_KEY = "user_table";

export const userTableQueryOptions = (searchParams: string) =>
  queryOptions({
    queryKey: [USER_TABLE_QUERY_KEY, searchParams],
    queryFn: async ({ queryKey }) => {
      const [, searchParams] = queryKey;
      try {
        const res = await UserApiRequests.findAllPaginated(searchParams);
        return res.payload;
      } catch (error) {
        console.log("Error fetching users:", error);
        throw error;
      }
    },
  });

export const USERS_QUERY_KEY = "users";

export const usersQueryOptions = () =>
  queryOptions({
    queryKey: [USERS_QUERY_KEY],
    queryFn: async () => {
      try {
        const res = await UserApiRequests.findAll();
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

export const USER_PROFILE_QUERY_KEY = "user_profile";

export const userProfileQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: [USER_PROFILE_QUERY_KEY, userId],
    queryFn: async ({ queryKey }) => {
      const [, userId] = queryKey;
      try {
        const res = await UserApiRequests.getUserProfile(userId);
        return res.payload.data;
      } catch (error) {
        console.log("Error fetching user profile:", error);
        throw error;
      }
    },
  });
