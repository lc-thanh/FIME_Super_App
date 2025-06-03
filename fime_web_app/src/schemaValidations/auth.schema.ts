import z from "zod";

export const RegisterRes = z
  .object({
    data: z.object({
      user: z.object({
        id: z.string(),
        fullname: z.string(),
        image: z.string().nullable(),
        email: z.string(),
        role: z.array(z.string()),
      }),
      access_token: z.string(),
      refresh_token: z.string(),
      expires_at: z.number(),
    }),
    message: z.string(),
  })
  .strict();
export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
  .object({
    username: z
      .string()
      .min(1, { message: "Email/Số điện thoại không được để trống!" })
      .max(256, { message: "Email/Số điện thoại quá dài!" }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự!" })
      .max(20, { message: "Mật khẩu quá dài!" }),
  })
  .strict();
export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = RegisterRes;
export type LoginResType = z.TypeOf<typeof LoginRes>;

export const ChangePasswordBody = z
  .object({
    oldPassword: z
      .string()
      .min(6, { message: "Mật khẩu cũ phải có ít nhất 6 ký tự!" })
      .max(20, { message: "Mật khẩu cũ quá dài!" }),
    newPassword: z
      .string()
      .min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự!" })
      .max(20, { message: "Mật khẩu mới quá dài!" }),
    repeatPassword: z.string(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.oldPassword === data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu mới phải khác mật khẩu cũ!",
        path: ["newPassword"],
      });
    }
    if (data.newPassword !== data.repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu mới và xác nhận mật khẩu không khớp!",
        path: ["repeatPassword"],
      });
    }
  });
export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>;
