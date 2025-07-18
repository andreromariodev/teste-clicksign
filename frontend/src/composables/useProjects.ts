import { ref, computed, watch } from 'vue'
import { ProjectService } from '@/services/projectService'
import { useToast } from '@/composables/useToast'
import type { Project, ProjectFilters, PaginatedResponse } from '@/types/project'

export function useProjects() {
  const { showError, showSuccess } = useToast()
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
      showError(
        'Erro ao carregar projetos',
        'Não foi possível carregar a lista de projetos. Tente novamente.'
      )
      console.error('Error loading projects:', err)
    } finally {
      loading.value = false
    }
  }

  const toggleFavorite = async (id: string) => {
    try {
      const updatedProject = await ProjectService.toggleFavorite(id)
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        if (filters.value.onlyFavorites && !updatedProject.isFavorite) {
          projects.value.splice(index, 1)
          paginationInfo.value.total = Math.max(0, paginationInfo.value.total - 1)
          const newTotalPages = Math.ceil(paginationInfo.value.total / (filters.value.limit || 12))
          paginationInfo.value.totalPages = newTotalPages

          if (projects.value.length === 0 && paginationInfo.value.page > 1) {
            setPage(paginationInfo.value.page - 1)
            return
          }

          paginationInfo.value.hasNextPage = paginationInfo.value.page < newTotalPages
          paginationInfo.value.hasPrevPage = paginationInfo.value.page > 1
        } else {
          projects.value[index] = updatedProject
        }
      }
    } catch (err) {
      error.value = 'Erro ao atualizar favorito'
      showError(
        'Erro ao atualizar favorito',
        'Não foi possível alterar o status de favorito. Tente novamente.'
      )
      console.error('Error toggling favorite:', err)
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await ProjectService.deleteProject(id)
      projects.value = projects.value.filter(p => p.id !== id)
      showSuccess('Projeto excluído', 'O projeto foi removido com sucesso.')
      await loadProjects()
    } catch (err) {
      error.value = 'Erro ao excluir projeto'
      showError(
        'Erro ao excluir projeto',
        'Não foi possível excluir o projeto. Tente novamente.'
      )
      console.error('Error deleting project:', err)
    }
  }

  const setSearch = (searchTerm: string) => {
    filters.value.search = searchTerm
    filters.value.page = 1
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

  const hasProjects = computed(() => projects.value.length > 0)
  const totalProjects = computed(() => paginationInfo.value.total)
  const currentPage = computed(() => filters.value.page || 1)
  const totalPages = computed(() => paginationInfo.value.totalPages)

  watch(
    filters,
    () => {
      loadProjects()
    },
    { deep: true }
  )

  return {
    projects,
    loading,
    error,
    paginationInfo,
    filters,
    hasProjects,
    totalProjects,
    currentPage,
    totalPages,
    loadProjects,
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
