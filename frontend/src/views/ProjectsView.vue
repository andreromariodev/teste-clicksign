<template>
  <AppLayout>
    <div class="container">
      <div :class="$style.projectsPage">
        <!-- Header -->
        <div :class="$style.header">
          <div :class="$style.titleSection">
            <h1 :class="$style.title">
              Projetos ({{ totalProjects }})
            </h1>
          </div>

          <div :class="$style.topFilters">
            <label :class="$style.favoritesToggle">
              <input
                type="checkbox"
                :checked="onlyFavorites"
                @change="onToggleFavorites"
                :class="$style.checkbox"
              />
              <span :class="$style.toggleText"></span>
              <span>
                Apenas Favoritos
              </span>
            </label>
            <div :class="$style.sortSection">
              <select
                :value="sortBy"
                @change="onSortChange"
                :class="$style.sortSelect"
              >
                <option value="name">Ordem alfabética</option>
                <option value="startDate">Data de início</option>
                <option value="endDate">Data de finalização</option>
              </select>
            </div>

            <router-link to="/projects/new" :class="$style.newProjectBtn">
              Novo projeto
            </router-link>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" :class="$style.loading">
          <div :class="$style.spinner"></div>
          <p>Carregando projetos...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" :class="$style.error">
          {{ error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="!hasProjects && !loading" :class="$style.emptyState">
          <div :class="$style.emptyIcon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17ZM17 21V10L12 5" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h3 :class="$style.emptyTitle">
            {{ searchTerm || onlyFavorites ? 'Nenhum projeto encontrado' : 'Nenhum projeto cadastrado' }}
          </h3>
          <p :class="$style.emptyDescription">
            {{ searchTerm || onlyFavorites
              ? 'Tente ajustar os filtros ou criar um novo projeto.'
              : 'Comece criando seu primeiro projeto.'
            }}
          </p>
          <router-link to="/projects/new" :class="$style.createBtn">
            Criar primeiro projeto
          </router-link>
        </div>

        <!-- Projects Grid -->
        <div v-else :class="$style.projectsGrid">
          <ProjectCard
            v-for="project in projects"
            :key="project.id"
            :project="project"
            :search-term="searchTerm"
            @toggle-favorite="toggleFavorite"
            @delete="showDeleteModal"
          />
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="hasProjects"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total="totalProjects"
          :has-next-page="paginationInfo.hasNextPage"
          :has-prev-page="paginationInfo.hasPrevPage"
          @next="goToNextPage"
          @prev="goToPrevPage"
          @goto="goToPage"
        />

        <!-- Delete Confirmation Modal -->
        <ConfirmModal
          :show="deleteModal.show"
          :loading="deleteModal.loading"
          title="Remover projeto"
          :message="`Tem certeza que deseja remover o projeto '${deleteModal.projectName}'?`"
          description="Esta ação não poderá ser desfeita."
          confirm-text="Remover"
          cancel-text="Cancelar"
          @confirm="confirmDelete"
          @cancel="hideDeleteModal"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import ProjectSearch from '@/components/project/ProjectSearch.vue'
import Pagination from '@/components/ui/Pagination.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { useProjects } from '@/composables/useProjects'
import { useSearchHistory } from '@/composables/useSearchHistory'

const route = useRoute()
const router = useRouter()

const {
  projects,
  loading,
  error,
  paginationInfo,
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
} = useProjects()

const { searchHistory, addToHistory, clearHistory } = useSearchHistory()

const searchTerm = ref('')
const onlyFavorites = ref(false)
const sortBy = ref<'name' | 'startDate' | 'endDate'>('name')

const deleteModal = ref({
  show: false,
  loading: false,
  projectId: '',
  projectName: ''
})

const onSearch = (term: string) => {
  searchTerm.value = term
  setSearch(term)

  // Adicionar ao histórico se tiver pelo menos 3 caracteres
  if (term.trim().length >= 3) {
    addToHistory(term.trim())
  }

  // Atualizar a URL
  const query = { ...route.query }
  if (term) {
    query.search = term
  } else {
    delete query.search
  }
  query.page = '1' // Reset para primeira página

  router.push({ query })
}

const onToggleFavorites = (event: Event) => {
  const target = event.target as HTMLInputElement
  onlyFavorites.value = target.checked
  setOnlyFavorites(target.checked)

  // Atualizar a URL
  const query = { ...route.query }
  if (target.checked) {
    query.favorites = 'true'
  } else {
    delete query.favorites
  }
  query.page = '1' // Reset para primeira página

  router.push({ query })
}

const onSortChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  sortBy.value = target.value as 'name' | 'startDate' | 'endDate'
  setSorting(sortBy.value, 'asc')

  // Atualizar a URL
  const query = { ...route.query }
  query.sort = sortBy.value
  query.page = '1' // Reset para primeira página

  router.push({ query })
}

const clearSearchHistory = () => {
  clearHistory()
}

// Funções de navegação que atualizam a URL
const goToPage = (page: number) => {
  const query = { ...route.query, page: page.toString() }
  router.push({ query })
}

const goToNextPage = () => {
  if (paginationInfo.value.hasNextPage) {
    goToPage(currentPage.value + 1)
  }
}

const goToPrevPage = () => {
  if (paginationInfo.value.hasPrevPage) {
    goToPage(currentPage.value - 1)
  }
}

const showDeleteModal = (projectId: string) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    deleteModal.value = {
      show: true,
      loading: false,
      projectId,
      projectName: project.name
    }
  }
}

const hideDeleteModal = () => {
  deleteModal.value.show = false
}

const confirmDelete = async () => {
  deleteModal.value.loading = true
  try {
    await deleteProject(deleteModal.value.projectId)
    hideDeleteModal()
  } catch (err) {
    console.error('Error deleting project:', err)
  } finally {
    deleteModal.value.loading = false
  }
}

// Observar mudanças na rota para sincronizar o estado
watch(() => route.query, (newQuery) => {
  // Sincronizar busca
  const searchFromUrl = (newQuery.search as string) || ''
  if (searchFromUrl !== searchTerm.value) {
    searchTerm.value = searchFromUrl
    setSearch(searchFromUrl)
  }

  // Sincronizar favoritos
  const favoritesFromUrl = newQuery.favorites === 'true'
  if (favoritesFromUrl !== onlyFavorites.value) {
    onlyFavorites.value = favoritesFromUrl
    setOnlyFavorites(favoritesFromUrl)
  }

  // Sincronizar ordenação
  const sortFromUrl = (newQuery.sort as string) || 'name'
  const validSorts = ['name', 'startDate', 'endDate'] as const
  const sortValue = validSorts.includes(sortFromUrl as any) ? sortFromUrl as 'name' | 'startDate' | 'endDate' : 'name'
  if (sortValue !== sortBy.value) {
    sortBy.value = sortValue
    setSorting(sortBy.value, 'asc')
  }

  // Sincronizar página
  const pageFromUrl = parseInt((newQuery.page as string) || '1')
  if (pageFromUrl !== currentPage.value) {
    setPage(pageFromUrl)
  }
}, { immediate: true })

onMounted(async () => {
  // Inicializar valores da URL
  const query = route.query
  searchTerm.value = (query.search as string) || ''
  onlyFavorites.value = query.favorites === 'true'

  // Validar sort da URL
  const sortFromUrl = (query.sort as string) || 'name'
  const validSorts = ['name', 'startDate', 'endDate'] as const
  sortBy.value = validSorts.includes(sortFromUrl as any) ? sortFromUrl as 'name' | 'startDate' | 'endDate' : 'name'

  // Aplicar os filtros
  setSearch(searchTerm.value)
  setOnlyFavorites(onlyFavorites.value)
  setSorting(sortBy.value, 'asc')
  setPage(parseInt((query.page as string) || '1'))

  // Carregar projetos
  await loadProjects()
})
</script>

<style module>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-2xl);
}

.titleSection {
  flex: 0 0 auto;
}

.title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  margin: 0;
}

.topFilters {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.favoritesToggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  user-select: none;
}

.checkbox {
  display: none;
}

.toggleText {
  position: relative;
  padding-left: 3rem;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.toggleText::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3rem;
  height: 1.5rem;
  background: var(--color-background-dark);
  border: 2px solid var(--color-background-dark);
  border-radius: 1rem;
  transition: var(--transition-all);
}

.toggleText::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: .75rem;
  height: .75rem;
  background: var(--color-text-white);
  border-radius: 50%;
  transition: var(--transition-all);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.checkbox:checked + .toggleText::before {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
}

.checkbox:checked + .toggleText::after {
  left: calc(100% - 1.25rem - 2px);
}

.sortSection {
  position: relative;
}

.sortSelect {
  appearance: none;
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) 2.5rem var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  min-width: 180px;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  transition: var(--transition-normal);
}

.sortSelect:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.newProjectBtn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-primary);
  color: var(--color-text-white);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-all);
  white-space: nowrap;
}

.newProjectBtn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.searchSection {
  margin-bottom: var(--spacing-xl);
}

.subtitle {
  color: var(--color-text-light);
  margin: 0;
  font-size: var(--font-size-base);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4xl) var(--spacing-2xl);
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-background-muted);
  border-top: 3px solid var(--color-primary);
  border-radius: var(--radius-round);
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-lg);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  background: var(--color-error-bg);
  border: 1px solid var(--color-border-primary);
  color: var(--color-error-text);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin: var(--spacing-2xl) 0;
  text-align: center;
}

.emptyState {
  text-align: center;
  padding: var(--spacing-4xl) var(--spacing-2xl);
}

.emptyIcon {
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: center;
}

.emptyTitle {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-md);
}

.emptyDescription {
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-2xl);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.createBtn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-primary);
  color: var(--color-text-white);
  padding: var(--button-padding-md);
  border-radius: var(--button-radius);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: var(--transition-all);
}

.createBtn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.projectsGrid {
  display: grid;
  grid-template-columns: var(--grid-columns);
  gap: var(--grid-gap);
  margin: var(--spacing-2xl) 0;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-lg);
  }

  .topFilters {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .sortSelect {
    min-width: auto;
    width: 100%;
  }

  .projectsGrid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}
</style>
