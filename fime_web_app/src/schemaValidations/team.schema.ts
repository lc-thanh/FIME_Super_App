import { zodPreprocess } from "@/lib/utils";
import { z } from "zod";

export const Team = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  usersCount: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TeamType = z.infer<typeof Team>;

export const TeamPaginatedResponse = z.object({
  data: z.array(Team),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
export type TeamPaginatedResponseType = z.infer<typeof TeamPaginatedResponse>;

export const CreateTeamBody = z
  .object({
    name: z
      .string()
      .min(3, { message: "Tên ban phải có ít nhất 3 ký tự!" })
      .max(50, {
        message: "Tên ban quá dài!",
      }),
    description: z.preprocess(zodPreprocess, z.string().optional()),
  })
  .strict();
export type CreateTeamBodyType = z.infer<typeof CreateTeamBody>;

export const UpdateTeamBody = CreateTeamBody;
export type UpdateTeamBodyType = z.infer<typeof UpdateTeamBody>;
