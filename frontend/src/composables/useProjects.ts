import { ref, computed, watch } from 'vue'
import { ProjectService } from '@/services/projectService'
import type { Project, ProjectFilters, PaginatedResponse } from '@/types/project'

export function useProjects() {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const paginationInfo = ref<Omit<PaginatedResponse<Project>, 'data'>>({
    total: 0,
    page: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  const filters = ref<ProjectFilters>({
    search: '',
    onlyFavorites: false,
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 12
  })

  const searchHistory = ref<string[]>([])

  const loadProjects = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await ProjectService.getAllProjects(filters.value)
      projects.value = response.data
      paginationInfo.value = {
        total: response.total,
        page: response.page,
        totalPages: response.totalPages,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage
      }
    } catch (err) {
      error.value = 'Erro ao carregar projetos'
      console.error('Error loading projects:', err)
    } finally {
      loading.value = false
    }
  }

  const loadSearchHistory = async () => {
    try {
      searchHistory.value = await ProjectService.getSearchHistory()
    } catch (err) {
      console.error('Error loading search history:', err)
    }
  }

  const clearSearchHistory = async () => {
    try {
      await ProjectService.clearSearchHistory()
      searchHistory.value = []
    } catch (err) {
      console.error('Error clearing search history:', err)
    }
  }

  const toggleFavorite = async (id: string) => {
    try {
      const updatedProject = await ProjectService.toggleFavorite(id)
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = updatedProject
      }
    } catch (err) {
      error.value = 'Erro ao atualizar favorito'
      console.error('Error toggling favorite:', err)
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await ProjectService.deleteProject(id)
      projects.value = projects.value.filter(p => p.id !== id)
      // Recarregar para ajustar paginação
      await loadProjects()
    } catch (err) {
      error.value = 'Erro ao excluir projeto'
      console.error('Error deleting project:', err)
    }
  }

  const setSearch = (searchTerm: string) => {
    filters.value.search = searchTerm
    filters.value.page = 1 // Reset to first page when searching
  }

  const setOnlyFavorites = (onlyFavorites: boolean) => {
    filters.value.onlyFavorites = onlyFavorites
    filters.value.page = 1
  }

  const setSorting = (sortBy: 'name' | 'startDate' | 'endDate', sortOrder: 'asc' | 'desc' = 'asc') => {
    filters.value.sortBy = sortBy
    filters.value.sortOrder = sortOrder
    filters.value.page = 1
  }

  const setPage = (page: number) => {
    filters.value.page = page
  }

  const nextPage = () => {
    if (paginationInfo.value.hasNextPage) {
      setPage(filters.value.page! + 1)
    }
  }

  const prevPage = () => {
    if (paginationInfo.value.hasPrevPage) {
      setPage(filters.value.page! - 1)
    }
  }

  // Computed properties
  const hasProjects = computed(() => projects.value.length > 0)
  const totalProjects = computed(() => paginationInfo.value.total)
  const currentPage = computed(() => filters.value.page || 1)
  const totalPages = computed(() => paginationInfo.value.totalPages)

  // Watch for filter changes and reload projects
  watch(
    filters,
    () => {
      loadProjects()
    },
    { deep: true }
  )

  return {
    // State
    projects,
    loading,
    error,
    paginationInfo,
    filters,
    searchHistory,

    // Computed
    hasProjects,
    totalProjects,
    currentPage,
    totalPages,

    // Methods
    loadProjects,
    loadSearchHistory,
    clearSearchHistory,
    toggleFavorite,
    deleteProject,
    setSearch,
    setOnlyFavorites,
    setSorting,
    setPage,
    nextPage,
    prevPage
  }
}
