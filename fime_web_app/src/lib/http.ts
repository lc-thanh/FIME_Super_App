/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "@/config";
import { signOut as signOutClient } from "next-auth/react";
import { auth } from "@/auth";
import AuthApiRequests from "@/requests/auth.request";

type CustomOptions = Omit<RequestInit, "method"> & {
  isPublic?: boolean | undefined; // Nếu là true thì không cần phải truyền access_token vào header
  baseUrl?: string | undefined;
  notAutoLogout?: boolean | undefined; // Nếu là true thì không tự động logout khi nhận 401 statusCode
};

class ClientTokens {
  private _access_token = "";
  get access_token() {
    return this._access_token;
  }
  set access_token(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    // Vì nếu nhiều client sử dụng chung 1 object clientTokens thì sẽ bị overwrite
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this._access_token = token;
  }

  private _refresh_token = "";
  get refresh_token() {
    return this._refresh_token;
  }
  set refresh_token(token: string) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this._refresh_token = token;
  }

  private _expires_at = 0;
  get expires_at() {
    return this._expires_at;
  }
  set expires_at(value: number) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this._expires_at = value;
  }
}
export const clientTokens = new ClientTokens();

const ENTITY_ERROR_STATUS = 422;

type EntityErrorPayload = {
  message: [
    {
      field: string;
      error: string;
    }
  ];
  statusCode: number;
  error: string;
};

// Nên kế thừa từ Error để có thể sử dụng nhiều thuộc tính, phương thức có sẵn của Error
export class HttpError extends Error {
  status: number;
  payload: any;

  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body
    ? options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined;

  let baseHeaders: { Authorization?: string; "Content-Type"?: string } = {};
  if (!options?.isPublic) {
    if (typeof window !== "undefined") {
      baseHeaders = {
        Authorization: `Bearer ${clientTokens.access_token}`,
      };
    } else {
      const session = await auth();
      baseHeaders = {
        Authorization: `Bearer ${session?.user.access_token}`,
      };
    }
  }
  if (!(options?.body instanceof FormData)) {
    baseHeaders["Content-Type"] = "application/json";
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy giá trị từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì => gọi API đến Next Server
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  // Kiểm tra xem nếu thiếu dấu / ở đầu url thì thêm vào
  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    method,
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
  });

  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === 401 && !options?.notAutoLogout) {
      if (typeof window !== "undefined") {
        await AuthApiRequests.logout(clientTokens.refresh_token);
        signOutClient();
      } else {
        // const session = await auth();
        // redirect(
        //   "/logout?token=" + session?.user.refresh_token,
        //   RedirectType.push
        // );
      }
    } else {
      throw new HttpError(data);
    }
  }

  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  patch<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PATCH", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
