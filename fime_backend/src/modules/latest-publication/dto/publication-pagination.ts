import { PublicationViewDto } from '@/modules/latest-publication/dto/publication-view.dto';

export const defaultSortBy = 'createdAt';

export const validSortByFields = [
  'title',
  'isActive',
  'createdAt',
  'updatedAt',
];

export const defaultSortOrder = 'desc';

export interface PublicationFilterType {
  search?: string;
  pageSize?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PublicationPaginatedResponse {
  data: PublicationViewDto[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
