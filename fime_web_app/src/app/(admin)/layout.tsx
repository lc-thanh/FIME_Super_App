import AuthProvider from "@/providers/auth-provider";
import { auth } from "@/auth";
import TokenRefresher from "@/components/token-refresher";
import React from "react";
import { UserRoleStoreProvider } from "@/providers/user-role-provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <AuthProvider
      initTokens={{
        access_token: user?.access_token,
        refresh_token: user?.refresh_token,
        expires_at: user?.expires_at,
        user: user,
      }}
    >
      <UserRoleStoreProvider initialId={user?.id} initialRoles={user?.role}>
        <section>{children}</section>
      </UserRoleStoreProvider>
      <TokenRefresher />
    </AuthProvider>
  );
}
