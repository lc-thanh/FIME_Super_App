import { PositionViewDto } from '@/modules/position/dto/position-view.dto';

export const defaultSortBy = 'createdAt';

export const validSortByFields = ['name', 'users', 'createdAt'];

export const defaultSortOrder = 'desc';

export interface PositionFilterType {
  search?: string;
  pageSize?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PositionPaginatedResponse {
  data: PositionViewDto[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
