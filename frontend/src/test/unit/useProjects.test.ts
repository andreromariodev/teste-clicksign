import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useProjects } from '../../composables/useProjects'
import { ProjectService } from '../../services/projectService'
import { useToast } from '../../composables/useToast'
import { mockProjects, mockPaginatedResponse } from '../helpers'

// Mock dos serviços
vi.mock('../../services/projectService')
vi.mock('../../composables/useToast')

const mockProjectService = ProjectService as any
const mockToast = useToast as any

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Setup dos mocks
    mockToast.mockReturnValue({
      showError: vi.fn(),
      showSuccess: vi.fn(),
      showWarning: vi.fn(),
      showInfo: vi.fn()
    })
  })

  describe('loadProjects', () => {
    it('deve carregar projetos com sucesso', async () => {
      const mockResponse = {
        data: mockProjects,
        total: 3,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      }

      mockProjectService.getAllProjects.mockResolvedValue(mockResponse)

      const { projects, loading, error, loadProjects, paginationInfo } = useProjects()

      expect(loading.value).toBe(false)
      expect(projects.value).toEqual([])

      await loadProjects()

      expect(loading.value).toBe(false)
      expect(projects.value).toEqual(mockProjects)
      expect(error.value).toBeNull()
      expect(paginationInfo.value).toEqual({
        total: 3,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      })
    })

    it('deve mostrar loading durante carregamento', async () => {
      let resolveFn: (value: any) => void
      const promise = new Promise(resolve => {
        resolveFn = resolve
      })

      mockProjectService.getAllProjects.mockReturnValue(promise)

      const { loading, loadProjects } = useProjects()

      const loadPromise = loadProjects()

      // Durante o carregamento
      expect(loading.value).toBe(true)

      resolveFn!(mockPaginatedResponse)
      await loadPromise

      // Após o carregamento
      expect(loading.value).toBe(false)
    })

    it('deve tratar erro no carregamento', async () => {
      const mockError = new Error('Erro de rede')
      mockProjectService.getAllProjects.mockRejectedValue(mockError)

      const mockShowError = vi.fn()
      mockToast.mockReturnValue({
        showError: mockShowError,
        showSuccess: vi.fn(),
        showWarning: vi.fn(),
        showInfo: vi.fn()
      })

      const { projects, loading, error, loadProjects } = useProjects()

      await loadProjects()

      expect(loading.value).toBe(false)
      expect(projects.value).toEqual([])
      expect(error.value).toBe('Erro ao carregar projetos')
      expect(mockShowError).toHaveBeenCalledWith(
        'Erro ao carregar projetos',
        'Não foi possível carregar a lista de projetos. Tente novamente.'
      )
    })
  })

  describe('createProject', () => {
    it('deve criar projeto com sucesso', async () => {
      const newProjectData = {
        name: 'Novo Projeto',
        client: 'Novo Cliente',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isFavorite: false
      }

      const createdProject = {
        id: '4',
        ...newProjectData,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }

      mockProjectService.createProject.mockResolvedValue(createdProject)
      mockProjectService.getAllProjects.mockResolvedValue(mockPaginatedResponse)

      const mockShowSuccess = vi.fn()
      mockToast.mockReturnValue({
        showError: vi.fn(),
        showSuccess: mockShowSuccess,
        showWarning: vi.fn(),
        showInfo: vi.fn()
      })

      const { createProject, projects } = useProjects()

      const result = await createProject(newProjectData)

      expect(result).toEqual(createdProject)
      expect(mockProjectService.createProject).toHaveBeenCalledWith(newProjectData)
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Projeto criado',
        'O projeto foi criado com sucesso!'
      )
    })

    it('deve tratar erro na criação', async () => {
      const newProjectData = {
        name: '',
        client: '',
        startDate: '',
        endDate: '',
        isFavorite: false
      }

      const mockError = new Error('Dados inválidos')
      mockProjectService.createProject.mockRejectedValue(mockError)

      const mockShowError = vi.fn()
      mockToast.mockReturnValue({
        showError: mockShowError,
        showSuccess: vi.fn(),
        showWarning: vi.fn(),
        showInfo: vi.fn()
      })

      const { createProject } = useProjects()

      await expect(createProject(newProjectData)).rejects.toThrow('Dados inválidos')
      expect(mockShowError).toHaveBeenCalledWith(
        'Erro ao criar projeto',
        'Não foi possível criar o projeto. Verifique os dados e tente novamente.'
      )
    })
  })

  describe('updateProject', () => {
    it('deve atualizar projeto com sucesso', async () => {
      const projectId = '1'
      const updateData = {
        name: 'Projeto Atualizado',
        isFavorite: true
      }

      const updatedProject = {
        ...mockProjects[0],
        ...updateData,
        updatedAt: '2024-01-02T00:00:00.000Z'
      }

      mockProjectService.updateProject.mockResolvedValue(updatedProject)
      mockProjectService.getAllProjects.mockResolvedValue(mockPaginatedResponse)

      const mockShowSuccess = vi.fn()
      mockToast.mockReturnValue({
        showError: vi.fn(),
        showSuccess: mockShowSuccess,
        showWarning: vi.fn(),
        showInfo: vi.fn()
      })

      const { updateProject } = useProjects()

      const result = await updateProject(projectId, updateData)

      expect(result).toEqual(updatedProject)
      expect(mockProjectService.updateProject).toHaveBeenCalledWith(projectId, updateData)
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Projeto atualizado',
        'O projeto foi atualizado com sucesso!'
      )
    })
  })

  describe('deleteProject', () => {
    it('deve deletar projeto com sucesso', async () => {
      const projectId = '1'

      mockProjectService.deleteProject.mockResolvedValue(undefined)
      mockProjectService.getAllProjects.mockResolvedValue(mockPaginatedResponse)

      const mockShowSuccess = vi.fn()
      mockToast.mockReturnValue({
        showError: vi.fn(),
        showSuccess: mockShowSuccess,
        showWarning: vi.fn(),
        showInfo: vi.fn()
      })

      const { deleteProject } = useProjects()

      await deleteProject(projectId)

      expect(mockProjectService.deleteProject).toHaveBeenCalledWith(projectId)
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Projeto excluído',
        'O projeto foi removido com sucesso.'
      )
    })
  })

  describe('toggleFavorite', () => {
    it('deve alterar status de favorito com sucesso', async () => {
      const projectId = '1'
      const toggledProject = {
        ...mockProjects[0],
        isFavorite: true,
        updatedAt: '2024-01-02T00:00:00.000Z'
      }

      mockProjectService.toggleFavorite.mockResolvedValue(toggledProject)
      mockProjectService.getAllProjects.mockResolvedValue(mockPaginatedResponse)

      const mockShowSuccess = vi.fn()
      mockToast.mockReturnValue({
        showError: vi.fn(),
        showSuccess: mockShowSuccess,
        showWarning: vi.fn(),
        showInfo: vi.fn()
      })

      const { toggleFavorite } = useProjects()

      const result = await toggleFavorite(projectId)

      expect(result).toEqual(toggledProject)
      expect(mockProjectService.toggleFavorite).toHaveBeenCalledWith(projectId)
    })
  })

  describe('filtros', () => {
    it('deve aplicar filtro de busca', async () => {
      mockProjectService.getAllProjects.mockResolvedValue(mockPaginatedResponse)

      const { filters, setSearch, loadProjects } = useProjects()

      setSearch('website')

      expect(filters.value.search).toBe('website')

      await loadProjects()

      expect(mockProjectService.getAllProjects).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'website'
        })
      )
    })

    it('deve aplicar filtro de favoritos', async () => {
      mockProjectService.getAllProjects.mockResolvedValue(mockPaginatedResponse)

      const { filters, setOnlyFavorites, loadProjects } = useProjects()

      setOnlyFavorites(true)

      expect(filters.value.onlyFavorites).toBe(true)

      await loadProjects()

      expect(mockProjectService.getAllProjects).toHaveBeenCalledWith(
        expect.objectContaining({
          onlyFavorites: true
        })
      )
    })

    it('deve aplicar ordenação', async () => {
      mockProjectService.getAllProjects.mockResolvedValue(mockPaginatedResponse)

      const { filters, setSorting, loadProjects } = useProjects()

      setSorting('startDate', 'desc')

      expect(filters.value.sortBy).toBe('startDate')
      expect(filters.value.sortOrder).toBe('desc')

      await loadProjects()

      expect(mockProjectService.getAllProjects).toHaveBeenCalledWith(
        expect.objectContaining({
          sortBy: 'startDate',
          sortOrder: 'desc'
        })
      )
    })

    it('deve navegar entre páginas', async () => {
      mockProjectService.getAllProjects.mockResolvedValue(mockPaginatedResponse)

      const { filters, setPage, loadProjects } = useProjects()

      setPage(2)

      expect(filters.value.page).toBe(2)

      await loadProjects()

      expect(mockProjectService.getAllProjects).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2
        })
      )
    })
  })

  describe('propriedades computadas', () => {
    it('deve calcular se há projetos', () => {
      const { projects, hasProjects } = useProjects()

      expect(hasProjects.value).toBe(false)

      projects.value = mockProjects
      expect(hasProjects.value).toBe(true)
    })

    it('deve calcular se pode carregar mais páginas', () => {
      const { paginationInfo, canLoadMore } = useProjects()

      expect(canLoadMore.value).toBe(false)

      paginationInfo.value = {
        total: 20,
        page: 1,
        totalPages: 2,
        hasNextPage: true,
        hasPrevPage: false
      }

      expect(canLoadMore.value).toBe(true)
    })
  })
})
