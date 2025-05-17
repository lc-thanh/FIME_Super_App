import http from "@/lib/http";
import { WorkspaceType } from "@/schemaValidations/workspace.schema";

export const WorkspaceApiRequest = {
  myWorkspaces: async () => {
    try {
      const res = await http.get<{ message: string; data: WorkspaceType[] }>(
        "/workspaces/my",
        { notAutoLogout: true }
      );
      return res.payload.data.map((workspace) => ({
        name: workspace.name,
        url: `/workspace/${workspace.id}`,
      }));
    } catch (error) {
      console.log("Fetch myWorkspaces error: ", error);
    }
  },
};
