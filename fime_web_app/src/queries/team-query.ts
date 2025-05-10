import { TeamApiRequests } from "@/requests/team.request";
import { queryOptions } from "@tanstack/react-query";

export const TEAMS_QUERY_KEY = "teams";

export const teamsQueryOptions = (searchParams: string) =>
  queryOptions({
    queryKey: [TEAMS_QUERY_KEY, searchParams],
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

export const TEAM_SELECTORS_QUERY_KEY = "teamSelectors";

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

export const TEAM_QUERY_KEY = "team";

export const teamQueryOptions = (teamId: string) =>
  queryOptions({
    queryKey: [TEAM_QUERY_KEY, teamId],
    queryFn: async ({ queryKey }) => {
      const [, teamId] = queryKey;
      try {
        const res = await TeamApiRequests.findOne(teamId);
        return res.payload.data;
      } catch (error) {
        console.log("Error fetching team:", error);
        throw error;
      }
    },
  });
