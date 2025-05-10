import { PositionApiRequests } from "@/requests/position.request";
import { queryOptions } from "@tanstack/react-query";

export const POSITIONS_QUERY_KEY = "positions";

export const positionsQueryOptions = (searchParams: string) =>
  queryOptions({
    queryKey: [POSITIONS_QUERY_KEY, searchParams],
    queryFn: async ({ queryKey }) => {
      const [, searchParams] = queryKey;
      try {
        const res = await PositionApiRequests.findAll(searchParams);
        return res.payload;
      } catch (error) {
        console.log("Error fetching positions:", error);
        throw error;
      }
    },
  });

export const POSITION_SELECTORS_QUERY_KEY = "positionSelectors";

export const positionSelectors = () =>
  queryOptions({
    queryKey: [POSITION_SELECTORS_QUERY_KEY],
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

export const POSITION_QUERY_KEY = "position";

export const positionQueryOptions = (positionId: string) =>
  queryOptions({
    queryKey: [POSITION_QUERY_KEY, positionId],
    queryFn: async ({ queryKey }) => {
      const [, positionId] = queryKey;
      try {
        const res = await PositionApiRequests.findOne(positionId);
        return res.payload.data;
      } catch (error) {
        console.log("Error fetching position:", error);
        throw error;
      }
    },
  });
