import { zodPreprocess } from "@/lib/utils";
import { z } from "zod";

export const NewestProduct = z.object({
  id: z.string().uuid(),
  title: z.string(),
  date: z.date().nullable().optional(),
  note: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type NewestProductType = z.infer<typeof NewestProduct>;

export const NewestProductPaginatedResponse = z.object({
  data: z.array(NewestProduct),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
export type NewestProductPaginatedResponseType = z.infer<
  typeof NewestProductPaginatedResponse
>;

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const CreateNewestProductBody = z
  .object({
    title: z
      .string()
      .min(1, { message: "Tiêu đề không được để trống!" })
      .max(100, {
        message: "Tiêu đề quá dài!",
      }),
    date: z
      .date({
        invalid_type_error: "Ngày không hợp lệ",
      })
      .optional(),
    note: z.preprocess(zodPreprocess, z.string().optional()),
    image: z
      .any()
      .refine(
        (file) => file?.size <= MAX_FILE_SIZE || !file,
        `Dung lượng file tối đa là 5MB!`
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Chỉ hỗ trợ các file có dạng: .jpg, .jpeg, .png and .webp"
      )
      .optional(),
    link: z.preprocess(
      zodPreprocess,
      z.string().url({ message: "URL không hợp lệ" }).optional()
    ),
  })
  .strict();
export type CreateNewestProductBodyType = z.infer<
  typeof CreateNewestProductBody
>;

export const UpdateNewestProductBody = CreateNewestProductBody;
export type UpdateNewestProductBodyType = z.infer<
  typeof UpdateNewestProductBody
>;
