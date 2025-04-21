"use client";

import authApiRequests from "@/requests/auth.request";
import { signOut as signOutClient } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const LogoutChild = () => {
  const searchParams = useSearchParams();
  const refresh_token = searchParams.get("token");

  useState(async () => {
    if (!refresh_token) return;
    await authApiRequests.logout(refresh_token || "");
  });

  useEffect(() => {
    signOutClient({ redirectTo: "/login" });
  }, []);

  return <p>Redirecting to login...</p>;
};
