import { NewestProductViewDto } from '@/modules/newest-product/dto/newest-product-view.dto';

export const defaultSortBy = 'createdAt';

export const validSortByFields = ['title', 'date', 'createdAt', 'updatedAt'];

export const defaultSortOrder = 'desc';

export interface NewestProductFilterType {
  search?: string;
  pageSize?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface NewestProductPaginatedResponse {
  data: NewestProductViewDto[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
