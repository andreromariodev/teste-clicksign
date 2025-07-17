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

  if (totalPages > 0) {
    pages.push(1)
  }

  let start = Math.max(2, currentPage - 1)
  let end = Math.min(totalPages - 1, currentPage + 1)

  if (currentPage <= 3) {
    end = Math.min(totalPages - 1, 4)
  }

  if (currentPage >= totalPages - 2) {
    start = Math.max(2, totalPages - 3)
  }

  if (start > 2) {
    pages.push(-1)
  }

  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== totalPages) {
      pages.push(i)
    }
  }

  if (end < totalPages - 1) {
    pages.push(-1)
  }

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
  gap: var(--spacing-sm);
  padding: var(--spacing-2xl) 0;
  flex-wrap: wrap;
}

.pageNumbers {
  display: flex;
  gap: var(--spacing-xs);
}

.pageBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border: 1px solid var(--color-border-secondary);
  background: var(--color-background-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: var(--transition-all);
  color: var(--color-text-secondary);
}

.pageBtn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pageBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pageBtn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-white);
}

.navBtn {
  padding: 0 var(--spacing-sm);
}

.pageInfo {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-left: var(--spacing-lg);
}

@media (max-width: 640px) {
  .pagination {
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .pageInfo {
    margin-left: 0;
    order: -1;
  }
}
</style>
