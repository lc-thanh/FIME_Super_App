import { zodPreprocess } from "@/lib/utils";
import { z } from "zod";

export const Position = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  usersCount: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type PositionType = z.infer<typeof Position>;

export const PositionPaginatedResponse = z.object({
  data: z.array(Position),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
export type PositionPaginatedResponse = z.infer<
  typeof PositionPaginatedResponse
>;

export const CreatePositionBody = z
  .object({
    name: z
      .string()
      .min(1, { message: "Tên chức vụ không được để trống!" })
      .max(50, {
        message: "Tên chức vụ quá dài!",
      }),
    description: z.preprocess(zodPreprocess, z.string().optional()),
  })
  .strict();
export type CreatePositionBodyType = z.infer<typeof CreatePositionBody>;

export const UpdatePositionBody = CreatePositionBody;
export type UpdatePositionBodyType = z.infer<typeof UpdatePositionBody>;
