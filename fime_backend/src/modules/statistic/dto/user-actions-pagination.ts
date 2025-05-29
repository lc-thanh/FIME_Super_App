import { User } from '@prisma/client';

export const defaultSortBy = 'createdAt';

export const validSortByFields = ['createdAt'];

export const defaultSortOrder = 'desc';

export interface UserActionViewDto {
  id: string;
  content: string;
  user: Pick<User, 'id' | 'fullname' | 'image'>;
  createdAt: Date;
}

export interface UserActionFilterType {
  search?: string;
  pageSize?: number;
  page?: number;
}

export interface UserActionsPaginatedResponse {
  data: UserActionViewDto[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
