<template>
  <AppLayout>
    <div class="container">
      <div :class="$style.searchResultsPage">
        <div :class="$style.header">
          <router-link to="/" :class="$style.backBtn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" />
            </svg>
            Voltar
          </router-link>
          <h1 :class="$style.title">Resultado da busca</h1>
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
            Nenhum projeto encontrado
          </h3>
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { useProjects } from '@/composables/useProjects'

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
  setPage,
} = useProjects()

const searchTerm = ref('')

const deleteModal = ref({
  show: false,
  loading: false,
  projectId: '',
  projectName: '',
})

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

onMounted(async () => {
  const query = route.query
  searchTerm.value = (query.search as string) || ''

  setSearch(searchTerm.value)
  setPage(parseInt((query.page as string) || '1'))

  await loadProjects()
})
</script>

<style module>
.searchResultsPage {
  min-height: 100vh;
  padding: var(--section-padding-vertical) 0;
}

.header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title {
  font-size: var(--font-size-title);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.backBtn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-primary);
  text-decoration: none;
  padding: 0.5rem 1rem 0.5rem 0;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  font-weight: 500;
  margin-bottom: 1rem;
}

.backBtn:hover {
  color: var(--color-text-light);
  background-color: var(--color-background-secondary);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem;
  text-align: center;
}

.spinner {
  width: var(--spinner-size);
  height: var(--spinner-size);
  border: 4px solid var(--color-spinner-bg);
  border-top: 4px solid var(--color-text-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: var(--color-error);
  background-color: var(--color-error-bg);
  border-radius: var(--radius-md);
  margin: 2rem 0;
}

.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.emptyTitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin: 0;
}

.projectsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .searchResultsPage {
    padding: 1rem 0;
  }

  .projectsGrid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
