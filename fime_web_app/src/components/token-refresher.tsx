"use client";

import { refreshTokenFromClient } from "@/actions";
import { clientTokens } from "@/lib/http";
import { useEffect, useCallback } from "react";

export default function TokenRefresher() {
  const refreshTokenFunc = useCallback(async () => {
    const res = await refreshTokenFromClient();
    if (res.expires_at && res.expires_at > clientTokens.expires_at) {
      clientTokens.access_token = res.access_token || "";
      clientTokens.refresh_token = res.refresh_token || "";
      clientTokens.expires_at = res.expires_at || 0;
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (
        !!clientTokens.expires_at &&
        clientTokens.expires_at - Date.now() < 1000 * 10
      ) {
        await refreshTokenFunc();
      }
    }, 1000 * 5);
    return () => clearInterval(interval);
  }, [refreshTokenFunc]);

  return null;
}
