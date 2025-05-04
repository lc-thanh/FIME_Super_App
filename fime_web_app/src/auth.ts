import {
  InvalidPasswordError,
  InvalidUsernameError,
  LockedAccountError,
} from "@/lib/errors";
import { EntityError, HttpError } from "@/lib/http";
import AuthApiRequests from "@/requests/auth.request";
import { randomUUID } from "crypto";
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const deviceId = randomUUID();

          const result = await AuthApiRequests.login(
            {
              username: credentials?.username as string,
              password: credentials?.password as string,
            },
            deviceId
          );

          const user = result.payload.data.user;
          const access_token = result.payload.data.access_token;
          const refresh_token = result.payload.data.refresh_token;
          const expires_at = result.payload.data.expires_at;

          return {
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            image: user.image,
            role: user.role,
            access_token,
            refresh_token,
            expires_at,
            deviceId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any;
        } catch (error) {
          if ((error as HttpError).status === 422) {
            if ((error as EntityError).payload.message[0].field === "username")
              throw new InvalidUsernameError();
            if ((error as EntityError).payload.message[0].field === "password")
              throw new InvalidPasswordError();
          } else if ((error as HttpError).status === 423) {
            throw new LockedAccountError();
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // User is available during sign-in
        // user có giá trị chỉ khi vừa Login xong, các lần sau sẽ không có
        token.user = user as User;
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user;
      session.error = token.error;
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
