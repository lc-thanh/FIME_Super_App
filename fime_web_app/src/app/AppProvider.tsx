"use client";

import { clientTokens } from "@/lib/http";
import { useState } from "react";

export default function AppProvider({
  children,
  initTokens,
}: {
  children: React.ReactNode;
  initTokens: {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
  };
}) {
  useState(() => {
    if (typeof window !== "undefined") {
      clientTokens.access_token = initTokens.access_token ?? "";
      clientTokens.refresh_token = initTokens.refresh_token ?? "";
      clientTokens.expires_at = initTokens.expires_at ?? 0;
    }
  });
  return <>{children}</>;
}
