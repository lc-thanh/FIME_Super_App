import envConfig from "@/config";
import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const AuthApiRequests = {
  login: (body: LoginBodyType, deviceId: string) =>
    http.post<LoginResType>(
      "/auth/login",
      { ...body, deviceId },
      { isPublic: true }
    ),
  refreshToken: (refresh_token: string, deviceId: string) =>
    http.post(
      "/auth/refresh-token",
      { refresh_token, deviceId },
      { isPublic: true }
    ),
  logout: async (refresh_token: string) => {
    try {
      const logoutRes = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },

          body: new URLSearchParams({
            refresh_token: refresh_token,
          }),
        }
      );

      if (!logoutRes.ok) {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.log("Logout error: ", error);
    }
  },
  changePassword: async (oldPassword: string, newPassword: string) =>
    http.post("/auth/change-password", {
      oldPassword,
      newPassword,
    }),
};

export default AuthApiRequests;
