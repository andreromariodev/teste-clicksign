import { vi } from 'vitest'
import type { ProjectService } from '../services/projectService'

// Mock da API do projeto
export const mockProjectService = {
  getAllProjects: vi.fn(),
  getProjectById: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
  toggleFavorite: vi.fn(),
  uploadCoverImage: vi.fn(),
  getSearchHistory: vi.fn(),
} as any

// Mock de projetos de exemplo
export const mockProjects = [
  {
    id: '1',
    name: 'Website E-commerce',
    client: 'Loja Online',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    coverImage: undefined,
    isFavorite: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'App Mobile',
    client: 'Startup Tech',
    startDate: '2024-02-01',
    endDate: '2024-11-30',
    coverImage: 'app-mobile.jpg',
    isFavorite: true,
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Sistema CRM',
    client: 'Empresa Corp',
    startDate: '2024-03-01',
    endDate: '2024-10-31',
    coverImage: undefined,
    isFavorite: false,
    createdAt: '2024-03-01T00:00:00.000Z',
    updatedAt: '2024-03-01T00:00:00.000Z'
  }
]

// Mock de resposta paginada
export const mockPaginatedResponse = {
  projects: mockProjects,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 3,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
  }
}

// Mock de histórico de busca
export const mockSearchHistory = [
  'website',
  'app',
  'sistema',
  'crm'
]

// Mock do router
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  currentRoute: {
    value: {
      path: '/',
      query: {},
      params: {}
    }
  }
}

// Mock do useToast
export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn()
}

// Funções helper para testes
export const createMockFile = (name: string, type: string = 'image/jpeg'): File => {
  const content = new Blob(['mock file content'], { type })
  const file = new File([content], name, { type })
  return file
}

export const createMockFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value)
    } else {
      formData.append(key, String(value))
    }
  })
  return formData
}

export const waitFor = (timeout: number = 0): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export const nextTick = (): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, 0))
}
