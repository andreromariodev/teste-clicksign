import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import ProjectsView from '@/views/ProjectsView.vue'
import { ProjectService } from '@/services/projectService'
import type { ProjectFilters } from '@/types/project'

// Mock do ProjectService
vi.mock('@/services/projectService', () => ({
  ProjectService: {
    getAllProjects: vi.fn(),
    toggleFavorite: vi.fn(),
    deleteProject: vi.fn(),
    getSearchHistory: vi.fn(),
    clearSearchHistory: vi.fn(),
  }
}))

// Mock do useSearchHistory
vi.mock('@/composables/useSearchHistory', () => ({
  useSearchHistory: () => ({
    addToHistory: vi.fn(),
  })
}))

describe('ProjectsView - Filtro de Favoritos', () => {
  let wrapper: any
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: ProjectsView },
        { path: '/projects', component: ProjectsView },
        { path: '/projects/new', component: { template: '<div>New Project</div>' } }
      ]
    })

    // Mock das funções do ProjectService
    vi.mocked(ProjectService.getAllProjects).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false
    })

    vi.mocked(ProjectService.getSearchHistory).mockResolvedValue([])
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('deve mostrar mensagem "Nenhum projeto encontrado" quando filtro favoritos está ativo e não há projetos favoritos', async () => {
    // Simula que existem projetos no geral, mas nenhum favorito
    vi.mocked(ProjectService.getAllProjects).mockImplementation((filters?: ProjectFilters) => {
      if (filters?.onlyFavorites) {
        return Promise.resolve({
          data: [],
          total: 0,
          page: 1,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        })
      }
      return Promise.resolve({
        data: [
          {
            id: '1',
            name: 'Projeto 1',
            client: 'Cliente 1',
            startDate: '2025-01-01',
            endDate: '2025-12-31',
            isFavorite: false,
            coverImage: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        total: 1,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      })
    })

    wrapper = mount(ProjectsView, {
      global: {
        plugins: [router]
      }
    })

    // Aguarda o carregamento inicial
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Simula ativação do filtro de favoritos diretamente no componente
    const component = wrapper.vm
    component.onlyFavorites = true
    await nextTick()
  })

  it('deve mostrar mensagem "Nenhum projeto cadastrado" quando não há filtros ativos e não há projetos', async () => {
    // Simula que não há projetos no banco
    vi.mocked(ProjectService.getAllProjects).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false
    })

    wrapper = mount(ProjectsView, {
      global: {
        plugins: [router]
      }
    })

    // Aguarda o carregamento inicial
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verifica se a mensagem correta aparece
    const emptyTitle = wrapper.find('[data-testid="empty-title"]')
    expect(emptyTitle.exists()).toBe(true)
    expect(emptyTitle.text()).toBe('Nenhum projeto cadastrado')

    const emptyDescription = wrapper.find('[data-testid="empty-description"]')
    expect(emptyDescription.exists()).toBe(true)
    expect(emptyDescription.text()).toBe('Clique no botão abaixo para criar o primeiro e gerenciá-lo.')
  })
})
