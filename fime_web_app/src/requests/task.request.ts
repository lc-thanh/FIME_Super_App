import http from "@/lib/http";
import { ColumnType, TaskStatusType } from "@/schemaValidations/task.schema";

export type MoveCardData = {
  cardId: string;
  cardBeforeId: string | null;
  cardAfterId: string | null;
  column: TaskStatusType;
};

export const TaskApiRequests = {
  myTaskCards: async (workspaceId: string) =>
    http.get<{ message: string; data: { columns: ColumnType[] } }>(
      `/tasks/my-task-cards/${workspaceId}`
    ),

  moveCard: async (
    data: MoveCardData & { workspaceId: string; socketId: string }
  ) => http.post<{ message: string }>("tasks/move-card", data),
};
