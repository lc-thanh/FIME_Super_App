import http from "@/lib/http";
import { PositionType } from "@/schemaValidations/position.schema";

export const PositionApiRequests = {
  findAllSelectors: async () => {
    return http.get<Pick<PositionType, "id" | "name">[]>(
      `/positions/selectors`
    );
  },
};
