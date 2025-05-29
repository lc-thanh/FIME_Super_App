import { StatisticApiRequests } from "@/requests/statistic.request";
import { queryOptions } from "@tanstack/react-query";

export const USER_ACTIONS_QUERY_KEY = "userActions";

export const userActionsQueryOptions = (searchParams: string) =>
  queryOptions({
    queryKey: [USER_ACTIONS_QUERY_KEY, searchParams],
    queryFn: async ({ queryKey }) => {
      const [, searchParams] = queryKey; // lấy searchParams từ queryKey
      try {
        const res = await StatisticApiRequests.getUserActions(searchParams);
        return res.payload;
      } catch (error) {
        console.log("Error fetching user actions:", error);
        throw error;
      }
    },
    staleTime: 0, // không lưu cache, luôn lấy dữ liệu mới
  });
