import envConfig from "@/config";
import { encode, getToken, JWT } from "next-auth/jwt";
import { NextMiddleware, NextRequest, NextResponse } from "next/server";

export const SIGNIN_SUB_URL = "/login";
export const ADMIN_SUB_URL = "/dashboard";
export const WORKSPACE_SUB_URL = "/workspace";
export const SESSION_TIMEOUT = 60 * 60 * 24 * 30; // 30 days
export const TOKEN_REFRESH_BUFFER = 1000 * 60 * 5; // 5 minutes before expiration
export const SESSION_SECURE =
  process.env.AUTH_URL?.startsWith("https://") || false;
export const SESSION_COOKIE = SESSION_SECURE
  ? "__Secure-authjs.session-token"
  : "authjs.session-token";

let isRefreshing = false;

export function shouldUpdateToken(token: JWT): boolean {
  return Date.now() >= token?.user.expires_at - TOKEN_REFRESH_BUFFER;
}

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (isRefreshing) {
    return token;
  }
  isRefreshing = true;

  try {
    const response = await fetch(
      envConfig.NEXT_PUBLIC_API_ENDPOINT + "/auth/refresh-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          refresh_token: token?.user.refresh_token,
          deviceId: token?.user.deviceId,
        }),
      }
    );

    const res = await response.json();
    if (!response.ok) {
      throw new Error(`Token refresh failed with status: ${response.status}`);
    }
    const newTokens = res.data;

    return {
      ...token,
      user: {
        ...token.user,
        access_token: newTokens?.access_token,
        expires_at: newTokens?.expires_at,
        refresh_token: newTokens?.refresh_token,
      },
    };
  } catch (e) {
    console.error(e);
  } finally {
    isRefreshing = false;
  }

  return token;
}

export function updateCookie(
  sessionToken: string | null,
  request: NextRequest,
  response: NextResponse
): NextResponse<unknown> {
  /*
   * Github discussions: https://github.com/nextauthjs/next-auth/discussions/9715#discussioncomment-8319836
   * BASIC IDEA:
   *
   * 1. Set request cookies for the incoming getServerSession to read new session
   * 2. Updated request cookie can only be passed to server if it's passed down here after setting its updates
   * 3. Set response cookies to send back to browser
   */

  if (sessionToken) {
    // Set the session token in the request and response cookies for a valid session
    request.cookies.set(SESSION_COOKIE, sessionToken);
    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      maxAge: SESSION_TIMEOUT,
      secure: SESSION_SECURE,
      sameSite: "lax",
    });
  } else {
    request.cookies.delete(SESSION_COOKIE);
    return NextResponse.redirect(new URL(SIGNIN_SUB_URL, request.url));
  }

  return response;
}

export const middleware: NextMiddleware = async (req: NextRequest) => {
  const token = (await getToken({
    secret: process.env.AUTH_SECRET as string,
    req,
    secureCookie: SESSION_SECURE,
    salt: SESSION_COOKIE,
    cookieName: SESSION_COOKIE,
  })) as JWT;

  const isAuthenticated = !!token;

  // === BƯỚC 1: TEAR-OUT PHẦN REDIRECT ===
  // 1.a Nếu chưa đăng nhập mà muốn vào trang /dashboard hoặc /workspace → redirect về /login
  if (!isAuthenticated) {
    if (
      req.nextUrl.pathname.startsWith(ADMIN_SUB_URL) ||
      req.nextUrl.pathname.startsWith(WORKSPACE_SUB_URL)
    ) {
      // Chuyển hướng lên trang login, kèm redirectFrom nếu muốn
      return NextResponse.redirect(
        new URL(
          `${SIGNIN_SUB_URL}?redirectFrom=${encodeURIComponent(
            req.nextUrl.pathname
          )}`,
          req.nextUrl.origin
        )
      );
    }
    // Nếu đang ở /login thì cho chạy tiếp, không redirect
    if (req.nextUrl.pathname === SIGNIN_SUB_URL) {
      return NextResponse.next();
    }
    // Các trang khác ngoài matcher (nếu có) cũng cho NextResponse.next()
    return NextResponse.next();
  }

  // 1.b Nếu đã đăng nhập mà cố truy cập vào /login → redirect về /dashboard
  if (req.nextUrl.pathname.startsWith(SIGNIN_SUB_URL)) {
    return NextResponse.redirect(new URL(ADMIN_SUB_URL, req.nextUrl.origin));
  }

  let response = NextResponse.next();
  if (shouldUpdateToken(token)) {
    try {
      const newSessionToken = await encode({
        secret: process.env.AUTH_SECRET as string,
        token: await refreshAccessToken(token),
        maxAge: SESSION_TIMEOUT,
        salt: SESSION_COOKIE,
      });
      response = updateCookie(newSessionToken, req, response);
    } catch (error) {
      console.log("Error refreshing token: ", error);
      return updateCookie(null, req, response);
    }
  }

  return response;
};

export const config = {
  matcher: ["/login/:path*", "/dashboard/:path*", "/workspace/:path*"],
};
