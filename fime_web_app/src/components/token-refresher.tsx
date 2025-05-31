"use client";

import { refreshTokenFromClient } from "@/actions";
import { clientTokens } from "@/lib/http";
import { useEffect, useCallback } from "react";

const TIME_INTERVAL = 1000 * 60; // Check every 1 minutes
const TOKEN_REFRESH_BUFFER = 1000 * 60 * 3; // 3 minutes before expiration

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
        clientTokens.expires_at - Date.now() < TOKEN_REFRESH_BUFFER
      ) {
        await refreshTokenFunc();
      }
    }, TIME_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshTokenFunc]);

  return null;
}
