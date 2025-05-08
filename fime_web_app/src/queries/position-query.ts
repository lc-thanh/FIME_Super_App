import { PositionApiRequests } from "@/requests/position.request";
import { queryOptions } from "@tanstack/react-query";

export const positionSelectors = () =>
  queryOptions({
    queryKey: ["position", "selectors"],
    queryFn: async () => {
      try {
        const res = await PositionApiRequests.findAllSelectors();
        return res.payload;
      } catch (error) {
        console.log("Error fetching position selectors:", error);
        throw error;
      }
    },
  });
