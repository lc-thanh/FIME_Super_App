import { createStore } from "zustand/vanilla";
import { createWorkspaceSlice, WorkspaceState } from "./workspace-slice";
import {
  ContextMenuState,
  createContextMenuSlice,
} from "@/stores/context-menu-slice";

export type BoundState = WorkspaceState & ContextMenuState;

export const createBoundStore = () => {
  return createStore<BoundState>((...a) => ({
    ...createWorkspaceSlice(...a),
    ...createContextMenuSlice(...a),
  }));
};
