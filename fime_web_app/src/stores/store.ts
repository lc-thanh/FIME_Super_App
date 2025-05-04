import { createStore } from "zustand/vanilla";
import { createWorkspaceSlice, WorkspaceState } from "./workspace-slice";

export type BoundState = WorkspaceState;

export const createBoundStore = () => {
  return createStore<BoundState>((...a) => ({
    ...createWorkspaceSlice(...a),
  }));
};
