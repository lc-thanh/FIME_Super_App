import { NewestProductApiRequests } from "@/requests/newest-product.request";
import { queryOptions } from "@tanstack/react-query";

export const NEWEST_PRODUCTS_QUERY_KEY = "newest_products";

export const newestProductsQueryOptions = (searchParams: string) =>
  queryOptions({
    queryKey: [NEWEST_PRODUCTS_QUERY_KEY, searchParams],
    queryFn: async ({ queryKey }) => {
      const [, searchParams] = queryKey;
      try {
        const res = await NewestProductApiRequests.findAll(searchParams);
        return res.payload;
      } catch (error) {
        console.log("Error fetching newest products:", error);
        throw error;
      }
    },
  });
