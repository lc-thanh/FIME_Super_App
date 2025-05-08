import { z } from "zod";

export const Team = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TeamType = z.infer<typeof Team>;
