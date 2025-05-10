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
  findAll: async (params: string) => {
    return http.get<UserPaginatedResponseType>(`/users?${params}`);
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
};
