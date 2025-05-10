import http from "@/lib/http";
import {
  CreatePositionBodyType,
  PositionPaginatedResponse,
  PositionType,
  UpdatePositionBodyType,
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

  findOne: async (positionId: string) => {
    return http.get<{ message: string; data: PositionType }>(
      `/positions/${positionId}`
    );
  },

  create: async (body: CreatePositionBodyType) => http.post("/positions", body),

  update: async (positionId: string, body: UpdatePositionBodyType) => {
    return http.put(`/positions/${positionId}`, body);
  },

  delete: async (positionId: string) => {
    return http.delete(`/positions/${positionId}`, {});
  },
};
