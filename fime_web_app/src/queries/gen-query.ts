import { GenApiRequests } from "@/requests/gen.request";
import { queryOptions } from "@tanstack/react-query";

export const GENS_QUERY_KEY = "gens";

export const gensQueryOptions = (searchParams: string) =>
  queryOptions({
    queryKey: [GENS_QUERY_KEY, searchParams],
    queryFn: async ({ queryKey }) => {
      const [, searchParams] = queryKey;
      try {
        const res = await GenApiRequests.findAll(searchParams);
        return res.payload;
      } catch (error) {
        console.log("Error fetching gens:", error);
        throw error;
      }
    },
  });

export const GEN_SELECTORS_QUERY_KEY = "genSelectors";

export const genSelectorsQueryOptions = () =>
  queryOptions({
    queryKey: [GEN_SELECTORS_QUERY_KEY],
    queryFn: async () => {
      try {
        const res = await GenApiRequests.findAllSelectors();
        return res.payload;
      } catch (error) {
        console.log("Error fetching gen selectors:", error);
        throw error;
      }
    },
  });

export const GEN_QUERY_KEY = "gen";

export const genQueryOptions = (genId: string) =>
  queryOptions({
    queryKey: [GEN_QUERY_KEY, genId],
    queryFn: async ({ queryKey }) => {
      const [, genId] = queryKey;
      try {
        const res = await GenApiRequests.findOne(genId);
        return res.payload.data;
      } catch (error) {
        console.log("Error fetching gen:", error);
        throw error;
      }
    },
  });
