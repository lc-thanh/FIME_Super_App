import { z } from "zod";

export const User = z.object({
  id: z.string().uuid(),
  fullname: z.string().min(1, { message: "Tên không được để trống!" }),
  email: z.string().email({ message: "Email không hợp lệ!" }),
  phone: z.string(),
  image: z.string().optional(),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự!" }),
  role: z.enum(["USER", "ADMIN"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});
