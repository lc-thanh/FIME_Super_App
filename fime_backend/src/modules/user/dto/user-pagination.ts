import { User } from '@prisma/client';

export interface UserFilterType {
  search?: string;
  pageSize?: number;
  page?: number;
}

export interface UserPaginatedResponse {
  data: User[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
