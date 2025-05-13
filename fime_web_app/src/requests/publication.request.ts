import http from "@/lib/http";
import {
  CreatePublicationBodyType,
  PublicationPaginatedResponseType,
  UpdatePublicationBodyType,
} from "@/schemaValidations/publication.schema";

export const PublicationApiRequests = {
  findAll: async (params: string) => {
    return http.get<PublicationPaginatedResponseType>(
      `/latest-publications?${params}`
    );
  },

  // findOne: async (genId: string) => {
  //   return http.get<{ message: string; data: GenType }>(`/gens/${genId}`);
  // },

  create: async (body: CreatePublicationBodyType) =>
    http.post("/latest-publications", body),

  update: async (publicationId: string, body: UpdatePublicationBodyType) => {
    return http.put(`/latest-publications/${publicationId}`, body);
  },

  active: async (publicationId: string) => {
    return http.post(`/latest-publications/${publicationId}/active`, {});
  },

  delete: async (id: string) => {
    return http.delete(`/latest-publications/${id}`, {});
  },
};
