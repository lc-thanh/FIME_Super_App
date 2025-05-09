import http from "@/lib/http";
import {
  CreateTeamBodyType,
  TeamPaginatedResponseType,
  TeamType,
} from "@/schemaValidations/team.schema";

export const TeamApiRequests = {
  findAll: async (params: string) => {
    return http.get<TeamPaginatedResponseType>(`/teams?${params}`);
  },

  findAllSelectors: async () => {
    return http.get<Pick<TeamType, "id" | "name">[]>(`/teams/selectors`);
  },

  create: async (body: CreateTeamBodyType) => http.post("/teams", body),
};
