import { zodPreprocess } from "@/lib/utils";
import { z } from "zod";

export const Gen = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  usersCount: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type GenType = z.infer<typeof Gen>;

export const GenPaginatedResponse = z.object({
  data: z.array(Gen),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
export type GenPaginatedResponseType = z.infer<typeof GenPaginatedResponse>;

export const CreateGenBody = z
  .object({
    name: z
      .string()
      .min(1, { message: "Tên Gen không được để trống!" })
      .max(20, {
        message: "Tên Gen quá dài!",
      }),
    description: z.preprocess(zodPreprocess, z.string().optional()),
  })
  .strict();
export type CreateGenBodyType = z.infer<typeof CreateGenBody>;

export const UpdateGenBody = CreateGenBody;
export type UpdateGenBodyType = z.infer<typeof UpdateGenBody>;
