import { TaskApiRequests } from "@/requests/task.request";
import { queryOptions } from "@tanstack/react-query";

export const TASK_QUERY_KEY = "task";
export const TASK_CARDS_QUERY_KEY = "taskCards";

export const taskQueryOptions = (taskId: string | null) =>
  queryOptions({
    queryKey: [TASK_QUERY_KEY, taskId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey; // lấy taskId từ queryKey
      try {
        if (!id) {
          return null;
        }

        const res = await TaskApiRequests.findOne(id);
        return res.payload.data;
      } catch (error) {
        console.log("Error fetching task:", error);
        throw error;
      }
    },
  });

export const taskCardsQueryOptions = (workspaceId: string) =>
  queryOptions({
    queryKey: [TASK_CARDS_QUERY_KEY, workspaceId],
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
