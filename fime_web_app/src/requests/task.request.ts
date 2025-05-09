import http from "@/lib/http";
import {
  ColumnType,
  TaskStatusType,
  TaskType,
} from "@/schemaValidations/task.schema";

export type MoveCardData = {
  cardId: string;
  cardBeforeId: string | null;
  cardAfterId: string | null;
  column: TaskStatusType;
};

export const TaskApiRequests = {
  findOne: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);
    return http.get<{ message: string; data: TaskType }>(`/tasks/${id}`);
  },

  myTaskCards: async (workspaceId: string) =>
    http.get<{ message: string; data: { columns: ColumnType[] } }>(
      `/tasks/my-task-cards/${workspaceId}`
    ),

  moveCard: async (
    data: MoveCardData & { workspaceId: string; socketId?: string }
  ) => {
    // const delay = (ms: number) =>
    //   new Promise((resolve) => setTimeout(resolve, ms));
    // await delay(2000);
    return http.post<{ message: string }>("tasks/move-card", data);
  },
};
