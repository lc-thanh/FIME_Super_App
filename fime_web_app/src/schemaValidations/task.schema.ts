import { User } from "@/schemaValidations/user.schema";
import { z } from "zod";

export const UserTask = User.pick({
  id: true,
  fullname: true,
  email: true,
  positionId: true,
  positionName: true,
  teamId: true,
  teamName: true,
  genId: true,
  genName: true,
  image: true,
}).extend({});
export type UserTaskType = z.infer<typeof UserTask>;

export const Assignee = UserTask.extend({
  isRecommended: z.boolean(),
});
export type AssigneeType = z.infer<typeof Assignee>;

export const TypeOfTask = z.enum([
  "TODO",
  "MONTHLY_SEGMENTS",
  "PUBLICATION",
  "EVENT",
  "MEETING",
  "TRAINING",
  "WORKSHOP",
]);
export type TypeOfTaskType = z.infer<typeof TypeOfTask>;

export const TaskStatus = z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]);
export type TaskStatusType = z.infer<typeof TaskStatus>;

export const TaskStatusText = {
  TODO: "Việc cần làm",
  IN_PROGRESS: "Đang thực hiện",
  IN_REVIEW: "Chờ đánh giá",
  DONE: "Hoàn thành",
};

export const TaskStatusTextColor = {
  TODO: "text-blue-500 bg-blue-50 dark:bg-blue-900 dark:text-blue-300",
  IN_PROGRESS:
    "text-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-300",
  IN_REVIEW:
    "text-purple-500 bg-purple-50 dark:bg-purple-900 dark:text-purple-300",
  DONE: "text-green-500 bg-green-50 dark:bg-green-900 dark:text-green-300",
};

export const TaskPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);
export type TaskPriorityType = z.infer<typeof TaskPriority>;

export const TodoItem = z.object({
  id: z.string().uuid().optional(),
  order: z.number().min(0),
  content: z.string(),
  isDone: z.boolean(),
  startDate: z.date().nullable(),
  deadline: z.date().nullable(),
  users: z.array(UserTask),
});
export type TodoItemType = z.infer<typeof TodoItem>;

export const TaskComment = z
  .object({
    id: z.string().uuid(),
    content: z.string(),
    user: UserTask,
    createdAt: z.date(),
  })
  .strict();
export type TaskCommentType = z.infer<typeof TaskComment>;

export const TaskAttachment = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    url: z.string(),
    user: UserTask.pick({
      id: true,
      fullname: true,
      image: true,
    }),
    createdAt: z.date(),
  })
  .strict();
export type TaskAttachmentType = z.infer<typeof TaskAttachment>;

export const CreateTaskAttachmentBody = z
  .object({
    title: z
      .string()
      .min(1, { message: "Tiêu đề không được để trống!" })
      .max(100, { message: "Tiêu đề quá dài!" }),
    url: z.string().url({ message: "URL không hợp lệ" }),
  })
  .strict();
export type CreateTaskAttachmentBodyType = z.infer<
  typeof CreateTaskAttachmentBody
>;

export const TypeOfTaskActivity = z.enum([
  "CREATE_CARD",
  "DELETE_CARD",
  "MOVE_CARD",
  "CHANGE_TITLE",
  "ADD_ASSIGNEE",
  "REMOVE_ASSIGNEE",
  "SYNC_TODO",
  "SYNC_NOTE",
  "ADD_ATTACHMENT",
  "REMOVE_ATTACHMENT",
  "CHANGE_PRIORITY",
  "CHANGE_TYPE",
  "CHANGE_DATE",
]);
export type TypeOfTaskActivityType = z.infer<typeof TypeOfTaskActivity>;

export const TaskActivity = z.object({
  id: z.string().uuid(),
  content: z.string(),
  type: TypeOfTaskActivity,
  user: UserTask.pick({
    id: true,
    fullname: true,
    image: true,
  }),
  createdAt: z.date(),
});
export type TaskActivityType = z.infer<typeof TaskActivity>;

export const TaskActivityPaginatedResponse = z.object({
  data: z.array(TaskActivity),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
export type TaskActivityPaginatedResponseType = z.infer<
  typeof TaskActivityPaginatedResponse
>;

export const Task = z.object({
  id: z.string().uuid(),
  title: z.string(),
  note: z.any(),
  position: z.number(),
  type: TypeOfTask,
  status: TaskStatus,
  priority: TaskPriority,
  startDate: z.date().nullable(),
  deadline: z.date().nullable(),
  todoLists: z.array(TodoItem),
  users: z.array(UserTask),
  taskComments: z.array(TaskComment),
  taskAttachments: z.array(TaskAttachment),
  taskActivities: z.array(TaskActivity),
  workspaceId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TaskType = z.infer<typeof Task>;

export const TaskCard = Task.pick({
  id: true,
  title: true,
  position: true,
  status: true,
  priority: true,
  users: true,
  startDate: true,
  deadline: true,
  type: true,
})
  .extend({})
  .strict();
export type TaskCardType = z.infer<typeof TaskCard>;

export const Column = z
  .object({
    id: TaskStatus,
    title: z.string(),
    cards: z.array(TaskCard),
  })
  .strict();
export type ColumnType = z.infer<typeof Column>;

export const ColumnIdToNumber = {
  [TaskStatus.Values.TODO]: 0,
  [TaskStatus.Values.IN_PROGRESS]: 1,
  [TaskStatus.Values.IN_REVIEW]: 2,
  [TaskStatus.Values.DONE]: 3,
};
