import { StateCreator } from "zustand/vanilla";

export interface ContextMenuState {
  selectedCard: string | null;
  contextMenuPosition: { x: number; y: number };
  setContextMenu: (
    cardId: string | null,
    position: { x: number; y: number }
  ) => void;
  clearContextMenu: () => void;
}

export const createContextMenuSlice: StateCreator<ContextMenuState> = (set) => {
  const slice: ContextMenuState = {
    selectedCard: null,
    contextMenuPosition: { x: 0, y: 0 },
    setContextMenu: (cardId, position) =>
      set({ selectedCard: cardId, contextMenuPosition: position }),
    clearContextMenu: () =>
      set({ selectedCard: null, contextMenuPosition: { x: 0, y: 0 } }),
  };

  return slice;
};
