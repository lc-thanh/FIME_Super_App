import { createStore } from "zustand/vanilla";

// ==============================
// Cấu hình Role Hierarchy
// ==============================
export const RoleHierarchy = [
  "FORMER_MEMBER",
  "MEMBER",
  "MANAGER",
  "ADMIN",
] as const;

export type Role = (typeof RoleHierarchy)[number];

export type UserRoleState = {
  roles: Role[];
};

export type UserRoleActions = {
  // Các hàm kiểm tra role
  hasMinimumRole: (requiredRole: Role) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isMember: () => boolean;
  isFormerMember: () => boolean;
};

export type UserRoleStore = UserRoleState & UserRoleActions;

// ==============================
// Khởi tạo giá trị mặc định
// ==============================
export const defaultInitState: UserRoleState = {
  roles: ["FORMER_MEMBER"],
};

// ==============================
// Khởi tạo Store
// ==============================
export const createUserRoleStore = (
  initState: UserRoleState = defaultInitState
) => {
  return createStore<UserRoleStore>()((set, get) => ({
    ...initState,

    // Kiểm tra role theo cấp bậc
    hasMinimumRole: (requiredRole) => {
      const { roles } = get();
      const minLevel = RoleHierarchy.indexOf(requiredRole);
      return roles.some((role) => RoleHierarchy.indexOf(role) >= minLevel);
    },
    isAdmin: () => get().hasMinimumRole("ADMIN"),
    isManager: () => get().hasMinimumRole("MANAGER"),
    isMember: () => get().hasMinimumRole("MEMBER"),
    isFormerMember: () => get().hasMinimumRole("FORMER_MEMBER"),
  }));
};
