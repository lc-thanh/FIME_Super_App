import { LucideIcon } from "lucide-react";
import { StateCreator } from "zustand/vanilla";

interface Workspace {
  name: string;
  url: string;
  icon: LucideIcon;
}

// export const initWorkspaces = async (): Promise<Workspace[] | undefined> => {
//   try {
//     const res = await workspaceApiRequest.myWorkspaces();
//     return res.payload.data.map((item) => ({
//       name: item.name,
//       url: `/task/${item.id}`,
//       icon: Frame,
//     }));
//   } catch (error) {
//     console.log(error);
//   }
// };

export type WorkspaceState = {
  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;
};

export const createWorkspaceSlice: StateCreator<WorkspaceState> = (set) => {
  // Khởi tạo slice
  const slice: WorkspaceState = {
    workspaces: [],
    setWorkspaces: (workspaces) => set({ workspaces }),
  };

  return slice;
};
