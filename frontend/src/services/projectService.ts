import axios from 'axios'
import type { Project, CreateProjectDto, UpdateProjectDto, ProjectFilters, PaginatedResponse } from '@/types/project'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export class ProjectService {
  static async getAllProjects(filters: ProjectFilters = {}): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams()

    if (filters.search) params.append('search', filters.search)
    if (filters.onlyFavorites) params.append('onlyFavorites', 'true')
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const response = await api.get(`/projects?${params.toString()}`)

    // Transformar a resposta do backend para o formato esperado pelo frontend
    const backendResponse = response.data
    return {
      data: backendResponse.data,
      total: backendResponse.pagination.total,
      page: backendResponse.pagination.page,
      totalPages: backendResponse.pagination.totalPages,
      hasNextPage: backendResponse.pagination.hasNext,
      hasPrevPage: backendResponse.pagination.hasPrev
    }
  }

  static async getProjectById(id: string): Promise<Project> {
    const response = await api.get(`/projects/${id}`)
    return response.data
  }

  static async createProject(projectData: CreateProjectDto): Promise<Project> {
    const formData = new FormData()

    formData.append('name', projectData.name)
    formData.append('client', projectData.client)
    formData.append('startDate', projectData.startDate)
    formData.append('endDate', projectData.endDate)

    if (projectData.coverImage) {
      formData.append('coverImage', projectData.coverImage)
    }

    const response = await api.post('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  static async updateProject(id: string, updateData: UpdateProjectDto): Promise<Project> {
    const formData = new FormData()

    if (updateData.name !== undefined) formData.append('name', updateData.name)
    if (updateData.client !== undefined) formData.append('client', updateData.client)
    if (updateData.startDate !== undefined) formData.append('startDate', updateData.startDate)
    if (updateData.endDate !== undefined) formData.append('endDate', updateData.endDate)
    if (updateData.isFavorite !== undefined) formData.append('isFavorite', updateData.isFavorite.toString())

    if (updateData.coverImage) {
      formData.append('coverImage', updateData.coverImage)
    }

    const response = await api.put(`/projects/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  static async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`)
  }

  static async toggleFavorite(id: string): Promise<Project> {
    const response = await api.patch(`/projects/${id}/favorite`)
    return response.data
  }

  static async getSearchHistory(): Promise<string[]> {
    const response = await api.get('/search-history')
    return response.data
  }

  static async clearSearchHistory(): Promise<void> {
    await api.delete('/search-history')
  }
}
