import { TeamApiRequests } from "@/requests/team.request";
import { queryOptions } from "@tanstack/react-query";

export const TEAM_SELECTORS_QUERY_KEY = "teamSelectors";
export const TEAM_QUERY_KEY = "teams";

export const teamQueryOptions = (searchParams: string) =>
  queryOptions({
    queryKey: [TEAM_QUERY_KEY, searchParams],
    queryFn: async ({ queryKey }) => {
      const [, searchParams] = queryKey;
      try {
        const res = await TeamApiRequests.findAll(searchParams);
        return res.payload;
      } catch (error) {
        console.log("Error fetching teams:", error);
        throw error;
      }
    },
  });

export const teamSelectorsQueryOptions = () =>
  queryOptions({
    queryKey: [TEAM_SELECTORS_QUERY_KEY],
    queryFn: async () => {
      try {
        const res = await TeamApiRequests.findAllSelectors();
        return res.payload;
      } catch (error) {
        console.log("Error fetching team selectors:", error);
        throw error;
      }
    },
  });
