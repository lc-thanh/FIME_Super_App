import { TaskActivityType, User } from '@prisma/client';

export const defaultSortBy = 'createdAt';

export const validSortByFields = ['createdAt'];

export const defaultSortOrder = 'desc';

export interface TaskActivityViewDto {
  id: string;
  content: string;
  type: TaskActivityType;
  user: Pick<User, 'id' | 'fullname' | 'image'>;
  createdAt: Date;
}

export interface TaskActivityFilterType {
  search?: string;
  pageSize?: number;
  page?: number;
}

export interface TaskActivitiesPaginatedResponse {
  data: TaskActivityViewDto[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
