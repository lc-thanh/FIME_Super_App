import http from "@/lib/http";
import {
  CreateGenBodyType,
  GenPaginatedResponseType,
  GenType,
  UpdateGenBodyType,
} from "@/schemaValidations/gen.schema";

export const GenApiRequests = {
  findAll: async (params: string) => {
    return http.get<GenPaginatedResponseType>(`/gens?${params}`);
  },

  findAllSelectors: async () => {
    return http.get<Pick<GenType, "id" | "name">[]>(`/gens/selectors`);
  },

  findOne: async (genId: string) => {
    return http.get<{ message: string; data: GenType }>(`/gens/${genId}`);
  },

  create: async (body: CreateGenBodyType) => http.post("/gens", body),

  update: async (genId: string, body: UpdateGenBodyType) => {
    return http.put(`/gens/${genId}`, body);
  },

  delete: async (genId: string) => {
    return http.delete(`/gens/${genId}`, {});
  },
};
