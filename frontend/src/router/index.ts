import { createRouter, createWebHistory } from 'vue-router'
import ProjectsView from '../views/ProjectsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'projects',
      component: ProjectsView,
    },
    {
      path: '/search',
      name: 'search-results',
      component: () => import('../views/SearchResultsView.vue'),
    },
    {
      path: '/projects/new',
      name: 'project-create',
      component: () => import('../views/ProjectFormView.vue'),
    },
    {
      path: '/projects/:id/edit',
      name: 'project-edit',
      component: () => import('../views/ProjectFormView.vue'),
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: () => import('../views/ProjectFormView.vue'),
    },
  ],
})

export default router
