import { User } from "@/schemaValidations/user.schema";
import { z } from "zod";

export const Workspace = z.object({
  id: z.string().uuid(),
  name: z.string(),
  users: z.array(User.pick({ id: true, fullname: true, image: true })),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type WorkspaceType = z.infer<typeof Workspace>;
