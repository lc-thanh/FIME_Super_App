import http from "@/lib/http";
import {
  CreatePositionBodyType,
  PositionPaginatedResponse,
  PositionType,
} from "@/schemaValidations/position.schema";

export const PositionApiRequests = {
  findAll: async (params: string) => {
    return http.get<PositionPaginatedResponse>(`/positions?${params}`);
  },

  findAllSelectors: async () => {
    return http.get<Pick<PositionType, "id" | "name">[]>(
      `/positions/selectors`
    );
  },

  create: async (body: CreatePositionBodyType) => http.post("/positions", body),
};
