import { z } from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_SOCKET_URL: z.string(),
  NEXT_PUBLIC_STATIC_ENDPOINT: z.string(),
  NEXT_PUBLIC_USER_DEFAULT_PASSWORD: z.string(),
  NEXT_PUBLIC_CLOUDFLARE_API_TOKEN: z.string(),
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  NEXT_PUBLIC_STATIC_ENDPOINT: process.env.NEXT_PUBLIC_STATIC_ENDPOINT,
  NEXT_PUBLIC_USER_DEFAULT_PASSWORD:
    process.env.NEXT_PUBLIC_USER_DEFAULT_PASSWORD,
  NEXT_PUBLIC_CLOUDFLARE_API_TOKEN:
    process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN,
});

if (!configProject.success) {
  console.error(configProject.error.issues);
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ!");
}

const envConfig = configProject.data;
export default envConfig;
