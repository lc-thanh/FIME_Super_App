import { zodPreprocess } from "@/lib/utils";
import { z } from "zod";

export const UserRole = z.enum(["ADMIN", "MANAGER", "MEMBER", "FORMER_MEMBER"]);
export type UserRoleType = z.infer<typeof UserRole>;

export const UserRoleText = {
  ADMIN: "Quản trị",
  MANAGER: "Quản lý",
  MEMBER: "Thành viên",
  FORMER_MEMBER: "Cựu thành viên",
};

export const UserStatus = z.enum(["ACTIVE", "INACTIVE", "BANNED"]);
export type UserStatusType = z.infer<typeof UserStatus>;

export const User = z.object({
  id: z.string().uuid(),
  fullname: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string().optional(),
  image: z.string().optional(),
  positionId: z.string().uuid().optional(),
  positionName: z.string().optional(),
  teamId: z.string().uuid().optional(),
  teamName: z.string().optional(),
  genId: z.string().uuid().optional(),
  genName: z.string().optional(),
  role: z.array(UserRole),
  status: UserStatus,

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type UserType = z.infer<typeof User>;

export const UserPaginatedResponse = z.object({
  data: z.array(User),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
export type UserPaginatedResponseType = z.infer<typeof UserPaginatedResponse>;

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const CreateUserBody = z
  .object({
    fullname: z
      .string()
      .min(3, { message: "Họ tên phải có ít nhất 3 ký tự" })
      .max(50, {
        message: "Họ tên không được quá 50 ký tự",
      }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    phone: z
      .string()
      .min(10, { message: "Số điện thoại không hợp lệ" })
      .max(15, { message: "Số điện thoại không hợp lệ" }),
    address: z.preprocess(
      zodPreprocess,
      z.string().max(256, { message: "Địa chỉ quá dài!" }).optional()
    ),
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
    positionId: z
      .string()
      .uuid({ message: "Chức vụ không hợp lệ!" })
      .optional(),
    teamId: z.string().uuid({ message: "Ban không hợp lệ!" }).optional(),
    genId: z.string().uuid({ message: "Gen không hợp lệ!" }).optional(),
    role: z.array(UserRole),
  })
  .strict();
export type CreateUserBodyType = z.infer<typeof CreateUserBody>;

export const UpdateUserBody = CreateUserBody;
export type UpdateUserBodyType = z.infer<typeof UpdateUserBody>;
