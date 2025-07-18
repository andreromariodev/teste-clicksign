<template>
  <AppLayout>
    <div class="container">
      <div :class="$style.projectsPage">
        <div v-if="hasProjects" :class="$style.header">
          <div :class="$style.titleSection">
            <h1 :class="$style.title">Projetos ({{ totalProjects }})</h1>
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
              <span> Apenas Favoritos </span>
            </label>
            <div :class="$style.sortSection">
              <select :value="sortBy" @change="onSortChange" :class="$style.sortSelect">
                <option value="name">Ordem alfabética</option>
                <option value="startDate">Data de início</option>
                <option value="endDate">Data de finalização</option>
              </select>
            </div>

            <router-link to="/projects/new" :class="$style.newProjectBtn">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path d="M12 8V16" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8 12H16" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span>Novo projeto</span>
            </router-link>
          </div>
        </div>

        <div v-if="loading" :class="$style.loading">
          <div :class="$style.spinner"></div>
          <p>Carregando projetos...</p>
        </div>

        <div v-else-if="error" :class="$style.error">
          {{ error }}
        </div>

        <div v-else-if="!hasProjects && !loading" :class="$style.emptyState">
          <h3 :class="$style.emptyTitle">
            Nenhum projeto
          </h3>
          <p :class="$style.emptyDescription">
            Clique no botão abaixo para criar o primeiro e gerenciá-lo.
          </p>
          <router-link to="/projects/new" :class="$style.createBtn">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path d="M12 8V16" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8 12H16" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span>Novo projeto</span>
          </router-link>
        </div>

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

        <ConfirmModal
          :show="deleteModal.show"
          :loading="deleteModal.loading"
          title="Remover projeto"
          description="Essa ação removerá definitivamente o projeto:"
          :project-name="deleteModal.projectName"
          confirm-text="Confirmar"
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
} = useProjects()

const { addToHistory } = useSearchHistory()

const searchTerm = ref('')
const onlyFavorites = ref(false)
const sortBy = ref<'name' | 'startDate' | 'endDate'>('name')

const deleteModal = ref({
  show: false,
  loading: false,
  projectId: '',
  projectName: '',
})

const onSearch = (term: string) => {
  searchTerm.value = term
  setSearch(term)

  if (term.trim().length >= 3) {
    addToHistory(term.trim())
  }

  const query = { ...route.query }
  if (term) {
    query.search = term
  } else {
    delete query.search
  }
  query.page = '1'

  router.push({ query })
}

const onToggleFavorites = (event: Event) => {
  const target = event.target as HTMLInputElement
  onlyFavorites.value = target.checked
  setOnlyFavorites(target.checked)

  const query = { ...route.query }
  if (target.checked) {
    query.favorites = 'true'
  } else {
    delete query.favorites
  }
  query.page = '1'

  router.push({ query })
}

const onSortChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  sortBy.value = target.value as 'name' | 'startDate' | 'endDate'
  setSorting(sortBy.value, 'asc')

  const query = { ...route.query }
  query.sort = sortBy.value
  query.page = '1'

  router.push({ query })
}

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
  const project = projects.value.find((p) => p.id === projectId)
  if (project) {
    deleteModal.value = {
      show: true,
      loading: false,
      projectId,
      projectName: project.name,
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

watch(
  () => route.query,
  (newQuery) => {
    const searchFromUrl = (newQuery.search as string) || ''
    if (searchFromUrl !== searchTerm.value) {
      searchTerm.value = searchFromUrl
      setSearch(searchFromUrl)
    }

    const favoritesFromUrl = newQuery.favorites === 'true'
    if (favoritesFromUrl !== onlyFavorites.value) {
      onlyFavorites.value = favoritesFromUrl
      setOnlyFavorites(favoritesFromUrl)
    }

    const sortFromUrl = (newQuery.sort as string) || 'name'
    const validSorts = ['name', 'startDate', 'endDate'] as const
    const sortValue = validSorts.includes(sortFromUrl as any)
      ? (sortFromUrl as 'name' | 'startDate' | 'endDate')
      : 'name'
    if (sortValue !== sortBy.value) {
      sortBy.value = sortValue
      setSorting(sortBy.value, 'asc')
    }

    const pageFromUrl = parseInt((newQuery.page as string) || '1')
    if (pageFromUrl !== currentPage.value) {
      setPage(pageFromUrl)
    }
  },
  { immediate: true },
)

onMounted(async () => {
  const query = route.query
  searchTerm.value = (query.search as string) || ''
  onlyFavorites.value = query.favorites === 'true'

  const sortFromUrl = (query.sort as string) || 'name'
  const validSorts = ['name', 'startDate', 'endDate'] as const
  sortBy.value = validSorts.includes(sortFromUrl as any)
    ? (sortFromUrl as 'name' | 'startDate' | 'endDate')
    : 'name'

  setSearch(searchTerm.value)
  setOnlyFavorites(onlyFavorites.value)
  setSorting(sortBy.value, 'asc')
  setPage(parseInt((query.page as string) || '1'))

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
  gap: var(--gap-medium);
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
  padding-left: var(--toggle-width);
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
  width: var(--toggle-width);
  height: var(--toggle-height);
  background: var(--color-background-dark);
  border: 2px solid var(--color-background-dark);
  border-radius: var(--toggle-height);
  transition: var(--transition-all);
}

.toggleText::after {
  content: '';
  position: absolute;
  left: var(--toggle-button-offset);
  top: 50%;
  transform: translateY(-50%);
  width: var(--toggle-button-size);
  height: var(--toggle-button-size);
  background: var(--color-text-white);
  border-radius: 50%;
  transition: var(--transition-all);
  box-shadow: var(--shadow-sm);
}

.checkbox:checked + .toggleText::before {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
}

.checkbox:checked + .toggleText::after {
  left: var(--toggle-button-offset-checked);
}

.sortSection {
  position: relative;
}

.sortSelect {
  appearance: none;
  background: var(--color-background-primary);
  border: 1px solid var(--color-text-muted);
  border-radius: var(--radius-md);
  padding: var(--form-padding);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  min-width: var(--form-min-width);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 2em 2em;
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
  padding: var(--form-padding-small);
  border-radius: var(--form-border-radius-large);
  text-decoration: none;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-all);
  white-space: nowrap;
}

.newProjectBtn:hover {
  background: var(--color-primary-hover);
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
  width: var(--spinner-size);
  height: var(--spinner-size);
  border: var(--spinner-border-width) solid var(--color-background-muted);
  border-top: var(--spinner-border-width) solid var(--color-primary);
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
  margin-top: var(--empty-state-margin-top);
  background-color: var(--color-background-white);
  min-height: var(--empty-state-min-height);
  border-radius: var(--radius-sm);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.emptyIcon {
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: center;
}

.emptyTitle {
  font-size: var(--empty-state-title-size);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary-alt);
  margin: 0 0 var(--spacing-md);
}

.emptyDescription {
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-2xl);
  max-width: var(--empty-state-max-width);
  margin-left: auto;
  margin-right: auto;
}

.createBtn {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-small);
  background: var(--color-primary);
  color: var(--color-text-white);
  padding: var(--form-padding-small);
  border-radius: var(--form-border-radius-large);
  text-decoration: none;
  font-size: var(--empty-state-btn-size);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-all);
  white-space: nowrap;
}

.createBtn:hover {
  background: var(--color-primary-hover);
}

.projectsGrid {
  display: grid;
  grid-template-columns: var(--grid-columns);
  gap: var(--grid-gap);
  margin: var(--spacing-2xl) 0;
}

@media (max-width: var(--media-mobile)) {
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
