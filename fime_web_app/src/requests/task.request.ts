import { type Event } from "@/app/(admin)/dashboard/schedule/_components/event-calendar";
import http from "@/lib/http";
import {
  AssigneeType,
  ColumnType,
  CreateTaskAttachmentBodyType,
  TaskActivityPaginatedResponseType,
  TaskAttachmentType,
  TaskPriorityType,
  TaskStatusType,
  TaskType,
  TypeOfTaskType,
} from "@/schemaValidations/task.schema";

export type MoveCardData = {
  cardId: string;
  cardBeforeId: string | null;
  cardAfterId: string | null;
  column: TaskStatusType;
};

export const TaskApiRequests = {
  create: async (workspaceId: string) =>
    http.post<{ message: string; data: TaskType }>(`/tasks/`, { workspaceId }),

  findOne: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);
    return http.get<{ message: string; data: TaskType }>(`/tasks/${id}`);
  },

  findOneDetails: async (id: string) => {
    // const delay = (ms: number) =>
    //   new Promise((resolve) => setTimeout(resolve, ms));
    // await delay(2000);
    return http.get<{ message: string; data: TaskType }>(
      `/tasks/task-details/${id}`
    );
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

  changeTitle: async (taskId: string, title: string) =>
    http.post<{ message: string; data: TaskType }>("tasks/change-title", {
      taskId,
      title,
    }),

  getAllSelectableAssignees: async (taskId: string) =>
    http.get<{
      message: string;
      data: AssigneeType[];
    }>(`tasks/all-selectable-assignees/${taskId}`),

  addAssignee: async (taskId: string, assigneeId: string) =>
    http.post<{ message: string; data: TaskType }>("tasks/add-assignee", {
      taskId,
      assigneeId,
    }),

  removeAssignee: async (taskId: string, assigneeId: string) =>
    http.post<{ message: string; data: TaskType }>("tasks/remove-assignee", {
      taskId,
      assigneeId,
    }),

  changePriority: async (taskId: string, priority: TaskPriorityType) =>
    http.post<{ message: string; data: TaskType }>("tasks/change-priority", {
      taskId,
      priority,
    }),

  changeType: async (taskId: string, type: TypeOfTaskType) =>
    http.post<{ message: string; data: TaskType }>("tasks/change-type", {
      taskId,
      type,
    }),

  changeTaskTime: async (
    taskId: string,
    startDate: Date | null,
    deadline: Date | null
  ) =>
    http.post<{ message: string; data: TaskType }>("tasks/change-date", {
      taskId,
      startDate,
      deadline,
    }),

  syncTodoList: async (taskId: string, todos: unknown) =>
    http.post<{ message: string }>("tasks/sync-todo-list", {
      taskId,
      todos,
    }),

  syncNote: async (taskId: string, note: unknown) =>
    http.post<{ message: string; data: TaskType }>("tasks/sync-note", {
      taskId,
      note,
    }),

  getTaskActivities: async (params: string, taskId: string) => {
    // const delay = (ms: number) =>
    //   new Promise((resolve) => setTimeout(resolve, ms));
    // await delay(2000);
    return http.get<TaskActivityPaginatedResponseType>(
      `tasks/task-activities/${taskId}?${params}`
    );
  },

  getTaskAttachments: async (taskId: string) => {
    return http.get<TaskAttachmentType[]>(`tasks/task-attachments/${taskId}`);
  },

  addTaskAttachment: async (
    taskId: string,
    body: CreateTaskAttachmentBodyType
  ) => {
    return http.post<{ message: string; data: TaskAttachmentType }>(
      `tasks/task-attachments/${taskId}`,
      {
        title: body.title,
        url: body.url,
      }
    );
  },

  deleteTaskAttachment: async (taskId: string, attachmentId: string) =>
    http.delete<{ message: string }>(
      `tasks/task-attachments/${taskId}/${attachmentId}`,
      {}
    ),

  softDelete: async (taskId: string) =>
    http.delete<{ message: string }>(`tasks/soft-delete/${taskId}`, {}),

  getSchedule: async () =>
    http.get<{ message: string; data: Event[] }>(`/tasks/schedule/`),
};
