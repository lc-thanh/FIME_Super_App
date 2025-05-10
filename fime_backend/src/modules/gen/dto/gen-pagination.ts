import { GenViewDto } from '@/modules/gen/dto/gen-view.dto';

export const defaultSortBy = 'createdAt';

export const validSortByFields = ['name', 'users', 'createdAt'];

export const defaultSortOrder = 'desc';

export interface GenFilterType {
  search?: string;
  pageSize?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GenPaginatedResponse {
  data: GenViewDto[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
