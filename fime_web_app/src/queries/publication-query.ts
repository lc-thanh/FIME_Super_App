import { PublicationApiRequests } from "@/requests/publication.request";
import { queryOptions } from "@tanstack/react-query";

export const PUBLICATIONS_QUERY_KEY = "latest_publications";

export const publicationsQueryOptions = (searchParams: string) =>
  queryOptions({
    queryKey: [PUBLICATIONS_QUERY_KEY, searchParams],
    queryFn: async ({ queryKey }) => {
      const [, searchParams] = queryKey;
      try {
        const res = await PublicationApiRequests.findAll(searchParams);
        return res.payload;
      } catch (error) {
        console.log("Error fetching latest publications:", error);
        throw error;
      }
    },
  });

// export const PUBLICATION_QUERY_KEY = "latest_publication";

// export const publicationQueryOptions = (publicationId: string) =>
//   queryOptions({
//     queryKey: [PUBLICATION_QUERY_KEY, publicationId],
//     queryFn: async ({ queryKey }) => {
//       const [, publicationId] = queryKey;
//       try {
//         const res = await PublicationApiRequests.findOne(publicationId);
//         return res.payload.data;
//       } catch (error) {
//         console.log("Error fetching latest publications:", error);
//         throw error;
//       }
//     },
//   });
