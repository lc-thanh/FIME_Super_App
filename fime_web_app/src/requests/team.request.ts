import http from "@/lib/http";
import {
  CreateTeamBodyType,
  TeamPaginatedResponseType,
  TeamType,
  UpdateTeamBodyType,
} from "@/schemaValidations/team.schema";

export const TeamApiRequests = {
  findAll: async (params: string) => {
    return http.get<TeamPaginatedResponseType>(`/teams?${params}`);
  },

  findAllSelectors: async () => {
    return http.get<Pick<TeamType, "id" | "name">[]>(`/teams/selectors`);
  },

  findOne: async (teamId: string) => {
    return http.get<{ message: string; data: TeamType }>(`/teams/${teamId}`);
  },

  create: async (body: CreateTeamBodyType) => http.post("/teams", body),

  update: async (teamId: string, body: UpdateTeamBodyType) => {
    return http.put(`/teams/${teamId}`, body);
  },

  delete: async (teamId: string) => {
    return http.delete(`/teams/${teamId}`, {});
  },
};
