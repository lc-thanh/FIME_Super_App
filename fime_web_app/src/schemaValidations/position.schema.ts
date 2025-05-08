import { z } from "zod";

export const Position = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type PositionType = z.infer<typeof Position>;
