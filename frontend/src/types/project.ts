export interface Project {
  id: string
  name: string
  client: string
  startDate: string
  endDate: string
  coverImage?: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProjectDto {
  name: string
  client: string
  startDate: string
  endDate: string
  coverImage?: File | null
}

export interface UpdateProjectDto {
  name?: string
  client?: string
  startDate?: string
  endDate?: string
  coverImage?: File | null
  isFavorite?: boolean
}

export interface ProjectFilters {
  search?: string
  onlyFavorites?: boolean
  sortBy?: 'name' | 'startDate' | 'endDate'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiError {
  error: string
}
