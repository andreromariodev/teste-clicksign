<template>
  <AppLayout>
    <div :class="$style.projectsPage">
      <!-- Header -->
      <div :class="$style.header">
        <div :class="$style.titleSection">
          <h1 :class="$style.title">Projetos</h1>
          <p :class="$style.subtitle">
            {{ totalProjects }} projeto{{ totalProjects !== 1 ? 's' : '' }} cadastrado{{ totalProjects !== 1 ? 's' : '' }}
          </p>
        </div>

        <div :class="$style.searchSection">
          <ProjectSearch
            v-model="searchTerm"
            :search-history="searchHistory"
            @search="onSearch"
            @clear-history="clearSearchHistory"
          />
        </div>
      </div>

      <!-- Filters -->
      <ProjectFilters
        v-model:only-favorites="onlyFavorites"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
      />

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
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import ProjectSearch from '@/components/project/ProjectSearch.vue'
import ProjectFilters from '@/components/project/ProjectFilters.vue'
import Pagination from '@/components/ui/Pagination.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { useProjects } from '@/composables/useProjects'

const router = useRouter()

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

// Local reactive state for UI
const searchTerm = ref('')
const onlyFavorites = ref(false)
const sortBy = ref<'name' | 'startDate' | 'endDate'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Delete modal state
const deleteModal = ref({
  show: false,
  loading: false,
  projectId: '',
  projectName: ''
})

// Methods
const onSearch = (term: string) => {
  setSearch(term)
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

// Watchers for filter changes
watch(onlyFavorites, (value) => {
  setOnlyFavorites(value)
})

watch([sortBy, sortOrder], ([newSortBy, newSortOrder]) => {
  setSorting(newSortBy, newSortOrder)
})

// Load data on mount
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
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.titleSection {
  flex: 1;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem;
}

.subtitle {
  color: #64748b;
  margin: 0;
  font-size: 1rem;
}

.searchSection {
  flex-shrink: 0;
  width: 100%;
  max-width: 400px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f1f5f9;
  border-top: 3px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin: 2rem 0;
  text-align: center;
}

.emptyState {
  text-align: center;
  padding: 4rem 2rem;
}

.emptyIcon {
  color: #9ca3af;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.emptyTitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem;
}

.emptyDescription {
  color: #6b7280;
  margin: 0 0 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.createBtn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #8b5cf6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.createBtn:hover {
  background: #7c3aed;
  transform: translateY(-1px);
}

.projectsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .searchSection {
    max-width: none;
  }

  .projectsGrid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
