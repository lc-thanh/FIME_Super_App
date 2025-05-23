"use client";

import { clientTokens } from "@/lib/http";
import { User } from "next-auth";
import { useState } from "react";

export default function AuthProvider({
  children,
  initTokens,
}: {
  children: React.ReactNode;
  initTokens: {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    user?: User;
  };
}) {
  useState(() => {
    if (typeof window !== "undefined") {
      clientTokens.access_token = initTokens.access_token ?? "";
      clientTokens.refresh_token = initTokens.refresh_token ?? "";
      clientTokens.expires_at = initTokens.expires_at ?? 0;
      clientTokens.user = initTokens.user ?? null;
    }
  });
  return <>{children}</>;
}
