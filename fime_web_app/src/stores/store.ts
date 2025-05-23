import { createStore } from "zustand/vanilla";
import {
  ContextMenuState,
  createContextMenuSlice,
} from "@/stores/context-menu-slice";

export type BoundState = ContextMenuState;

export const createBoundStore = () => {
  return createStore<BoundState>((...a) => ({
    ...createContextMenuSlice(...a),
  }));
};
