import { z } from "zod";

export const Workspace = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type WorkspaceType = z.infer<typeof Workspace>;
