import { TeamViewDto } from '@/modules/team/dto/team-view.dto';

export const defaultSortBy = 'createdAt';

export const validSortByFields = ['name', 'users', 'createdAt'];

export const defaultSortOrder = 'desc';

export interface TeamFilterType {
  search?: string;
  pageSize?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TeamPaginatedResponse {
  data: TeamViewDto[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
