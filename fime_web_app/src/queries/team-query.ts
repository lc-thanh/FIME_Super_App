import { TeamApiRequests } from "@/requests/team.request";
import { queryOptions } from "@tanstack/react-query";

export const TEAM_SELECTORS_QUERY_KEY = "teamSelectors";

export const teamSelectors = () =>
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
