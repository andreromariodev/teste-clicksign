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
            </label>
              <span>
                Apenas Favoritos
              </span>
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

        <!-- Search -->
        <div :class="$style.searchSection">
          <ProjectSearch
            v-model="searchTerm"
            :search-history="searchHistory"
            @search="onSearch"
            @clear-history="clearSearchHistory"
          />
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
          @next="nextPage"
          @prev="prevPage"
          @goto="setPage"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import ProjectSearch from '@/components/project/ProjectSearch.vue'
import Pagination from '@/components/ui/Pagination.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { useProjects } from '@/composables/useProjects'

const {
  projects,
  loading,
  error,
  paginationInfo,
  searchHistory,
  hasProjects,
  totalProjects,
  currentPage,
  totalPages,
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
} = useProjects()

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
  setSearch(term)
}

const onToggleFavorites = (event: Event) => {
  const target = event.target as HTMLInputElement
  setOnlyFavorites(target.checked)
}

const onSortChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  setSorting(target.value as 'name' | 'startDate' | 'endDate', 'asc')
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

onMounted(async () => {
  await Promise.all([
    loadProjects(),
    loadSearchHistory()
  ])
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
