import { UserViewDto } from '@/modules/user/dto/user-view.dto';

export const defaultSortBy = 'status';

export const validSortByFields = [
  'fullname',
  'email',
  'phone',
  'status',
  'createdAt',
];

export const defaultSortOrder = 'desc';

export interface UserFilterType {
  search?: string;
  pageSize?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserPaginatedResponse {
  data: UserViewDto[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
