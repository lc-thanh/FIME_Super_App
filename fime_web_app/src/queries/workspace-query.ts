import { WorkspaceApiRequest } from "@/requests/workspace.request";
import { queryOptions } from "@tanstack/react-query";

export const MY_WORKSPACES_QUERY_KEY = "myWorkspaces";

export const myWorkspacesQueryOptions = () =>
  queryOptions({
    queryKey: [MY_WORKSPACES_QUERY_KEY],
    queryFn: async () => {
      try {
        const res = await WorkspaceApiRequest.myWorkspaces();
        return res.payload.data;
      } catch (error) {
        console.log("Error fetching my workspaces:", error);
        throw error;
      }
    },
  });

export const WORKSPACE_QUERY_KEY = "workspace";

export const workspaceQueryOptions = (workspaceId: string) =>
  queryOptions({
    queryKey: [WORKSPACE_QUERY_KEY, workspaceId],
    queryFn: async () => {
      try {
        const res = await WorkspaceApiRequest.findOne(workspaceId);
        return res.payload.data;
      } catch (error) {
        console.log("Error fetching workspace:", error);
        throw error;
      }
    },
  });
