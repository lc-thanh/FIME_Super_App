"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import {
  type UserRoleStore,
  createUserRoleStore,
  defaultInitState,
  Role,
} from "@/stores/user-role-store";

// ==============================
// Tạo type cho Store API
// ==============================
export type UserRoleStoreApi = ReturnType<typeof createUserRoleStore>;

// ==============================
// Tạo Context cho Store
// ==============================
export const UserRoleStoreContext = createContext<UserRoleStoreApi | undefined>(
  undefined
);

export interface UserRoleStoreProviderProps {
  children: ReactNode;
  initialRoles?: Role[];
}

// ==============================
// Tạo Provider Component
// ==============================
export const UserRoleStoreProvider = ({
  children,
  initialRoles = [],
}: UserRoleStoreProviderProps) => {
  const storeRef = useRef<UserRoleStoreApi | null>(null);

  if (storeRef.current === null) {
    // Sử dụng initialRoles nếu có, nếu không fallback về default
    storeRef.current = createUserRoleStore({
      ...defaultInitState,
      roles: initialRoles,
    });
  }

  return (
    <UserRoleStoreContext.Provider value={storeRef.current}>
      {children}
    </UserRoleStoreContext.Provider>
  );
};

// ==============================
// Custom Hook để sử dụng Store
// ==============================
export const useUserRoleStore = <T,>(
  selector: (store: UserRoleStore) => T
): T => {
  const userRoleStoreContext = useContext(UserRoleStoreContext);

  if (!userRoleStoreContext) {
    throw new Error(
      `useUserRoleStore must be used within UserRoleStoreProvider`
    );
  }

  return useStore(userRoleStoreContext, selector);
};
