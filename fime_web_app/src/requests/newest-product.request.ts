import http from "@/lib/http";
import { objectToFormData } from "@/lib/utils";
import type {
  CreateNewestProductBodyType,
  NewestProductPaginatedResponseType,
  UpdateNewestProductBodyType,
} from "@/schemaValidations/newest-product.schema";

export const NewestProductApiRequests = {
  findAll: async (params: string) => {
    return http.get<NewestProductPaginatedResponseType>(
      `/newest-products?${params}`
    );
  },

  create: async (body: CreateNewestProductBodyType) => {
    const formData = objectToFormData(body);
    return http.post("/newest-products", formData);
  },

  update: async (
    productId: string,
    body: UpdateNewestProductBodyType & { isImageChanged: boolean }
  ) => {
    const formData = objectToFormData(body);
    return http.put(`/newest-products/${productId}`, formData);
  },

  delete: async (id: string) => {
    return http.delete(`/newest-products/${id}`, {});
  },
};
