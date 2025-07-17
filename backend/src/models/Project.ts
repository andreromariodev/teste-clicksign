export interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  isFavorite?: boolean;
}

export interface UpdateProjectDto {
  name?: string;
  client?: string;
  startDate?: string;
  endDate?: string;
  coverImage?: string;
  isFavorite?: boolean;
}

export interface ProjectFilters {
  search?: string;
  onlyFavorites?: boolean;
  sortBy?: 'name' | 'startDate' | 'endDate';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
