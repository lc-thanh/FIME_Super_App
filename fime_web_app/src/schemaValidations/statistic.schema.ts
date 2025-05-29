import { User } from "@/schemaValidations/user.schema";
import { z } from "zod";

export const TypeOfUserAction = z.enum([
  "ADD_MEMBER",
  "REMOVE_MEMBER",
  "EDIT_MEMBER",

  "ADD_TEAM",
  "REMOVE_TEAM",
  "EDIT_TEAM",

  "ADD_POSITION",
  "REMOVE_POSITION",
  "EDIT_POSITION",

  "ADD_GEN",
  "REMOVE_GEN",
  "EDIT_GEN",

  "ADD_WORKSPACE",
  "REMOVE_WORKSPACE",
  "EDIT_WORKSPACE_NAME",

  "ADD_LATEST_PUBLICATION",
  "ACTIVE_LATEST_PUBLICATION",
  "REMOVE_LATEST_PUBLICATION",
  "EDIT_LATEST_PUBLICATION",

  "ADD_NEWEST_PRODUCT",
  "REMOVE_NEWEST_PRODUCT",
  "EDIT_NEWEST_PRODUCT",
]);
export type TypeOfUserActionType = z.infer<typeof TypeOfUserAction>;

export const UserAction = z.object({
  id: z.string(),
  type: TypeOfUserAction,
  content: z.string(),
  user: User.pick({
    id: true,
    fullname: true,
    image: true,
  }),
  createdAt: z.date(),
});
export type UserActionType = z.infer<typeof UserAction>;

export const UserActionsPaginatedResponse = z.object({
  data: z.array(UserAction),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
export type UserActionsPaginatedResponseType = z.infer<
  typeof UserActionsPaginatedResponse
>;

export const TaskStatistics = z.object({
  totalTasks: z.number(),
  totalCompletedTasks: z.number(),
  totalHighPriorityTasks: z.number(),
  totalOverdueTasks: z.number(),
});
export type TaskStatisticsType = z.infer<typeof TaskStatistics>;
