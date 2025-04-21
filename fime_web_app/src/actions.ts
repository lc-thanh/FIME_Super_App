"use server";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(username: string, password: string) {
  try {
    const r = await signIn("credentials", {
      username: username,
      password: password,
      // callbackUrl: "/",
      redirect: false,
    });
    return r;
  } catch (error) {
    const errorType = (error as AuthError).type;
    switch ((error as AuthError).name) {
      case "InvalidUsernameError":
        return {
          error: errorType,
          code: 1,
        };
      case "InvalidPasswordError":
        return {
          error: errorType,
          code: 2,
        };
      case "LockedAccountError":
        return {
          error: errorType,
          code: 3,
        };
      default:
        return {
          error: "Internal server error",
          code: 0,
        };
    }
  }
}

export async function refreshTokenFromClient() {
  // Khi gọi hàm auth(), tokens sẽ được tự động refresh
  const session = await auth();
  return {
    access_token: session?.user.access_token,
    refresh_token: session?.user.refresh_token,
    expires_at: session?.user.expires_at,
  };
}
