import AuthProvider from "@/providers/auth-provider";
import { auth } from "@/auth";
import TokenRefresher from "@/components/token-refresher";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  const test = "abc";

  const childrenWithProps = React.Children.map(children, (child) =>
    React.isValidElement<{ test?: string }>(child)
      ? React.cloneElement(child, { test }) // truyền props ở đây
      : child
  );

  return (
    <AuthProvider
      initTokens={{
        access_token: user?.access_token || "abc",
        refresh_token: user?.refresh_token || "",
        expires_at: user?.expires_at || 0,
      }}
    >
      <section>{childrenWithProps}</section>
      <TokenRefresher />
    </AuthProvider>
  );
}
