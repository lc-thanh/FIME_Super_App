"use client";

import { type BoundState, createBoundStore } from "@/stores/store";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

export type BoundStoreApi = ReturnType<typeof createBoundStore>;

export const BoundStoreContext = createContext<BoundStoreApi | undefined>(
  undefined
);

export interface BoundStoreProviderProps {
  children: ReactNode;
}

export const BoundStoreProvider = ({ children }: BoundStoreProviderProps) => {
  const storeRef = useRef<BoundStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createBoundStore();
  }

  return (
    <BoundStoreContext.Provider value={storeRef.current}>
      {children}
    </BoundStoreContext.Provider>
  );
};

export const useBoundStore = <T,>(selector: (store: BoundState) => T): T => {
  const boundStoreContext = useContext(BoundStoreContext);

  if (!boundStoreContext) {
    throw new Error(`useBoundStore must be used within BoundStoreProvider`);
  }

  return useStore(boundStoreContext, selector);
};
