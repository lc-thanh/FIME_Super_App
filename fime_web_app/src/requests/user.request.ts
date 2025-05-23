import http from "@/lib/http";
import { objectToFormData } from "@/lib/utils";
import {
  CreateUserBodyType,
  UpdateUserBodyType,
  UserPaginatedResponseType,
  UserType,
} from "@/schemaValidations/user.schema";

export const UserApiRequests = {
  create: async (data: CreateUserBodyType) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);

    const formData = objectToFormData(data);

    return http.post("/users", formData);
  },
  findAll: async () => {
    return http.get<UserType[]>("/users");
  },
  findAllPaginated: async (params: string) => {
    return http.get<UserPaginatedResponseType>(`/users/paginated?${params}`);
  },
  findOne: async (userId: string) => {
    return http.get<{ message: string; data: UserType }>(`/users/${userId}`);
  },
  update: async (
    userId: string,
    data: UpdateUserBodyType & { isImageChanged: boolean }
  ) => {
    const formData = objectToFormData(data);
    return http.put(`/users/${userId}`, formData);
  },
  delete: async (userId: string) => {
    return http.delete(`/users/${userId}`, {});
  },
  resetPassword: async (userId: string) => {
    return http.post(`/users/${userId}/reset-password`, {});
  },
  lock: async (userId: string) => {
    return http.post(`/users/${userId}/lock`, {});
  },
  unlock: async (userId: string) => {
    return http.post(`/users/${userId}/unlock`, {});
  },
};
