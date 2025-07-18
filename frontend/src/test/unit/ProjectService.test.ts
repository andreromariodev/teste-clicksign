import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockProjects, mockPaginatedResponse } from '../helpers'

// Mock do módulo axios
vi.mock('axios', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  }
  
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance)
    }
  }
})

// Import do service após o mock
import { ProjectService } from '../../services/projectService'
import axios from 'axios'

// Get mock instance
const mockAxiosInstance = (axios as any).create()

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllProjects', () => {
    it('deve retornar lista de projetos sem filtros', async () => {
      const mockResponse = {
        data: {
          data: mockProjects,
          pagination: {
            total: 3,
            page: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        }
      }

      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const result = await ProjectService.getAllProjects()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/projects?')
      expect(result).toEqual({
        data: mockProjects,
        total: 3,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      })
    })

    it('deve aplicar filtros de busca', async () => {
      const filters = {
        search: 'website',
        onlyFavorites: true,
        sortBy: 'name' as const,
        sortOrder: 'asc' as const,
        page: 1,
        limit: 10
      }

      const mockResponse = {
        data: {
          data: [mockProjects[0]],
          pagination: {
            total: 1,
            page: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        }
      }

      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      await ProjectService.getAllProjects(filters)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/projects?search=website&onlyFavorites=true&sortBy=name&sortOrder=asc&page=1&limit=10'
      )
    })

    it('deve tratar erro de rede', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'))

      await expect(ProjectService.getAllProjects()).rejects.toThrow('Network error')
    })
  })

  describe('getProjectById', () => {
    it('deve retornar projeto por ID', async () => {
      const projectId = '1'
      const mockResponse = {
        data: mockProjects[0]
      }

      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const result = await ProjectService.getProjectById(projectId)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/projects/${projectId}`)
      expect(result).toEqual(mockProjects[0])
    })

    it('deve tratar erro 404', async () => {
      const projectId = '999'
      mockAxiosInstance.get.mockRejectedValue({
        response: {
          status: 404,
          data: { error: 'Project not found' }
        }
      })

      await expect(ProjectService.getProjectById(projectId)).rejects.toMatchObject({
        response: {
          status: 404,
          data: { error: 'Project not found' }
        }
      })
    })
  })

  describe('createProject', () => {
    it('deve criar projeto sem imagem', async () => {
      const projectData = {
        name: 'Novo Projeto',
        client: 'Novo Cliente',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isFavorite: false
      }

      const mockResponse = {
        data: {
          id: '4',
          ...projectData,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      }

      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const result = await ProjectService.createProject(projectData)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/projects',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('deve criar projeto com imagem', async () => {
      const mockFile = new File(['mock'], 'test.jpg', { type: 'image/jpeg' })
      const projectData = {
        name: 'Novo Projeto',
        client: 'Novo Cliente',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isFavorite: false,
        coverImage: mockFile
      }

      const mockResponse = {
        data: {
          id: '4',
          ...projectData,
          coverImage: 'test.jpg',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      }

      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const result = await ProjectService.createProject(projectData)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/projects',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('deve tratar erro de validação', async () => {
      const invalidData = {
        name: '',
        client: '',
        startDate: '',
        endDate: '',
        isFavorite: false
      }

      mockAxiosInstance.post.mockRejectedValue({
        response: {
          status: 400,
          data: { error: 'Invalid project data' }
        }
      })

      await expect(ProjectService.createProject(invalidData)).rejects.toMatchObject({
        response: {
          status: 400,
          data: { error: 'Invalid project data' }
        }
      })
    })
  })

  describe('updateProject', () => {
    it('deve atualizar projeto', async () => {
      const projectId = '1'
      const updateData = {
        name: 'Projeto Atualizado',
        isFavorite: true
      }

      const mockResponse = {
        data: {
          ...mockProjects[0],
          ...updateData,
          updatedAt: '2024-01-02T00:00:00.000Z'
        }
      }

      mockAxiosInstance.put.mockResolvedValue(mockResponse)

      const result = await ProjectService.updateProject(projectId, updateData)

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        `/projects/${projectId}`,
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('deve tratar erro 404', async () => {
      const projectId = '999'
      const updateData = { name: 'Projeto Atualizado' }

      mockAxiosInstance.put.mockRejectedValue({
        response: {
          status: 404,
          data: { error: 'Project not found' }
        }
      })

      await expect(ProjectService.updateProject(projectId, updateData)).rejects.toMatchObject({
        response: {
          status: 404,
          data: { error: 'Project not found' }
        }
      })
    })
  })

  describe('deleteProject', () => {
    it('deve deletar projeto', async () => {
      const projectId = '1'

      mockAxiosInstance.delete.mockResolvedValue({
        data: { message: 'Project deleted successfully' }
      })

      await ProjectService.deleteProject(projectId)

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/projects/${projectId}`)
    })

    it('deve tratar erro 404', async () => {
      const projectId = '999'

      mockAxiosInstance.delete.mockRejectedValue({
        response: {
          status: 404,
          data: { error: 'Project not found' }
        }
      })

      await expect(ProjectService.deleteProject(projectId)).rejects.toMatchObject({
        response: {
          status: 404,
          data: { error: 'Project not found' }
        }
      })
    })
  })

  describe('toggleFavorite', () => {
    it('deve alterar status de favorito', async () => {
      const projectId = '1'
      const mockResponse = {
        data: {
          ...mockProjects[0],
          isFavorite: true,
          updatedAt: '2024-01-02T00:00:00.000Z'
        }
      }

      mockAxiosInstance.patch.mockResolvedValue(mockResponse)

      const result = await ProjectService.toggleFavorite(projectId)

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/projects/${projectId}/favorite`)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getSearchHistory', () => {
    it('deve retornar histórico de busca', async () => {
      const mockHistory = ['website', 'app', 'sistema']
      const mockResponse = {
        data: mockHistory
      }

      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const result = await ProjectService.getSearchHistory()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search-history')
      expect(result).toEqual(mockHistory)
    })
  })
})
