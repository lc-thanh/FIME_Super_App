import { zodPreprocess } from "@/lib/utils";
import { z } from "zod";

export const LatestPublication = z.object({
  id: z.string().uuid(),
  title: z.string(),
  note: z.string().nullable().optional(),
  embed_code: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type LatestPublicationType = z.infer<typeof LatestPublication>;

export const PublicationPaginatedResponse = z.object({
  data: z.array(LatestPublication),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
export type PublicationPaginatedResponseType = z.infer<
  typeof PublicationPaginatedResponse
>;

export const CreatePublicationBody = z
  .object({
    title: z
      .string()
      .min(1, { message: "Tiêu đề không được để trống!" })
      .max(100, {
        message: "Tiêu đề quá dài!",
      }),
    note: z.preprocess(zodPreprocess, z.string().optional()),
    embed_code: z.string().min(1, { message: "Mã nhúng không được để trống!" }),
  })
  .strict();
export type CreatePublicationBodyType = z.infer<typeof CreatePublicationBody>;

export const UpdatePublicationBody = CreatePublicationBody;
export type UpdatePublicationBodyType = z.infer<typeof UpdatePublicationBody>;
