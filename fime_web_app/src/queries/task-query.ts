import { TaskApiRequests } from "@/requests/task.request";
import { queryOptions } from "@tanstack/react-query";

export const taskQueryOptions = (workspaceId: string) =>
  queryOptions({
    queryKey: ["task", workspaceId],
    queryFn: async ({ queryKey }) => {
      const [, wsId] = queryKey; // lấy workspaceId từ queryKey
      try {
        const res = await TaskApiRequests.myTaskCards(wsId);
        return res.payload.data;
      } catch (error) {
        console.log("Error fetching task cards:", error);
        throw error; // nhớ throw để react-query biết lỗi
      }
    },
  });
