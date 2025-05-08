import http from "@/lib/http";
import { TeamType } from "@/schemaValidations/team.schema";

export const TeamApiRequests = {
  findAllSelectors: async () => {
    return http.get<Pick<TeamType, "id" | "name">[]>(`/teams/selectors`);
  },
};
