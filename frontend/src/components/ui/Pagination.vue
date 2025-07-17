<template>
  <div v-if="totalPages > 1" :class="$style.pagination">
    <button
      @click="emit('prev')"
      :disabled="!hasPrevPage"
      :class="[$style.pageBtn, $style.navBtn]"
      title="Página anterior"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2"/>
      </svg>
    </button>

    <div :class="$style.pageNumbers">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="emit('goto', page)"
        :class="[$style.pageBtn, { [$style.active]: page === currentPage }]"
      >
        {{ page }}
      </button>
    </div>

    <button
      @click="emit('next')"
      :disabled="!hasNextPage"
      :class="[$style.pageBtn, $style.navBtn]"
      title="Próxima página"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2"/>
      </svg>
    </button>

    <div :class="$style.pageInfo">
      Página {{ currentPage }} de {{ totalPages }} ({{ total }} projetos)
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  total: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface Emits {
  (e: 'next'): void
  (e: 'prev'): void
  (e: 'goto', page: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visiblePages = computed(() => {
  const pages: number[] = []
  const { currentPage, totalPages } = props

  // Always show first page
  if (totalPages > 0) {
    pages.push(1)
  }

  // Calculate range around current page
  let start = Math.max(2, currentPage - 1)
  let end = Math.min(totalPages - 1, currentPage + 1)

  // Adjust range if we're near the beginning or end
  if (currentPage <= 3) {
    end = Math.min(totalPages - 1, 4)
  }

  if (currentPage >= totalPages - 2) {
    start = Math.max(2, totalPages - 3)
  }

  // Add ellipsis if needed
  if (start > 2) {
    pages.push(-1) // represents ellipsis
  }

  // Add middle pages
  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== totalPages) {
      pages.push(i)
    }
  }

  // Add ellipsis if needed
  if (end < totalPages - 1) {
    pages.push(-1) // represents ellipsis
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  return pages
})
</script>

<style module>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 0;
  flex-wrap: wrap;
}

.pageNumbers {
  display: flex;
  gap: 0.25rem;
}

.pageBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #374151;
}

.pageBtn:hover:not(:disabled) {
  border-color: #8b5cf6;
  color: #8b5cf6;
}

.pageBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pageBtn.active {
  background: #8b5cf6;
  border-color: #8b5cf6;
  color: white;
}

.navBtn {
  padding: 0 8px;
}

.pageInfo {
  font-size: 0.875rem;
  color: #64748b;
  margin-left: 1rem;
}

@media (max-width: 640px) {
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pageInfo {
    margin-left: 0;
    order: -1;
  }
}
</style>
