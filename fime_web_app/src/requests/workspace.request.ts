import http from "@/lib/http";
import { WorkspaceType } from "@/schemaValidations/workspace.schema";

export const WorkspaceApiRequest = {
  createWorkspace: (name: string) => {
    return http.post<{ message: string; data: WorkspaceType }>("/workspaces", {
      name,
    });
  },

  findOne: (workspaceId: string) => {
    return http.get<{ message: string; data: WorkspaceType }>(
      `/workspaces/${workspaceId}`
    );
  },

  myWorkspaces: () => {
    return http.get<{ message: string; data: WorkspaceType[] }>(
      "/workspaces/my"
    );
  },

  renameWorkspace: (workspaceId: string, name: string) => {
    return http.patch<{ message: string; data: WorkspaceType }>(
      `/workspaces/${workspaceId}`,
      {
        name,
      }
    );
  },

  deleteWorkspace: (workspaceId: string, password: string) => {
    return http.delete<{ message: string; data: WorkspaceType }>(
      `/workspaces/${workspaceId}`,
      {
        password,
      },
      {
        // headers: {
        //   "Content-Type": "application/x-www-form-urlencoded",
        // },
        notAutoLogout: true,
      }
    );
  },
};
