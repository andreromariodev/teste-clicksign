<template>
  <div :class="$style.filtersContainer">
    <div :class="$style.filterGroup">
      <label :class="$style.checkboxLabel">
        <input
          type="checkbox"
          :checked="onlyFavorites"
          @change="onToggleFavorites"
          :class="$style.checkbox"
        />
        <span :class="$style.checkboxText">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
            :fill="onlyFavorites ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"/>
          </svg>
          Apenas favoritos
        </span>
      </label>
    </div>

    <div :class="$style.filterGroup">
      <label :class="$style.selectLabel">
        Ordenar por:
        <select
          :value="sortBy"
          @change="onSortChange"
          :class="$style.select"
        >
          <option value="name">Nome (A-Z)</option>
          <option value="startDate">Data de início</option>
          <option value="endDate">Data de finalização</option>
        </select>
      </label>
    </div>

    <div :class="$style.filterGroup">
      <button
        @click="toggleSortOrder"
        :class="[$style.sortOrderBtn, { [$style.desc]: sortOrder === 'desc' }]"
        :title="sortOrder === 'asc' ? 'Ordem crescente' : 'Ordem decrescente'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 16L12 21L17 16M7 8L12 3L17 8" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  onlyFavorites: boolean
  sortBy: 'name' | 'startDate' | 'endDate'
  sortOrder: 'asc' | 'desc'
}

interface Emits {
  (e: 'update:onlyFavorites', value: boolean): void
  (e: 'update:sortBy', value: 'name' | 'startDate' | 'endDate'): void
  (e: 'update:sortOrder', value: 'asc' | 'desc'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const onToggleFavorites = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:onlyFavorites', target.checked)
}

const onSortChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:sortBy', target.value as 'name' | 'startDate' | 'endDate')
}

const toggleSortOrder = () => {
  emit('update:sortOrder', props.sortOrder === 'asc' ? 'desc' : 'asc')
}
</script>

<style module>
.filtersContainer {
  display: flex;
  gap: var(--spacing-xl);
  align-items: center;
  flex-wrap: wrap;
  padding: var(--spacing-lg);
  background: var(--color-background-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-primary);
}

.filterGroup {
  display: flex;
  align-items: center;
}

.checkboxLabel {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.checkbox {
  display: none;
}

.checkboxText {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
  transition: var(--transition-all);
  color: var(--color-text-light);
}

.checkboxLabel:hover .checkboxText {
  border-color: var(--color-border-hover);
  color: var(--color-text-secondary);
}

.checkbox:checked + .checkboxText {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-white);
}

.selectLabel {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.select {
  border: var(--input-border);
  border-radius: var(--input-radius);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  background: var(--color-background-primary);
  cursor: pointer;
  transition: var(--transition-normal);
}

.select:focus {
  outline: none;
  border: var(--input-border-focus);
}

.sortOrderBtn {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  cursor: pointer;
  color: var(--color-text-light);
  transition: var(--transition-all);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sortOrderBtn:hover {
  border-color: var(--color-border-hover);
  color: var(--color-text-secondary);
}

.sortOrderBtn.desc {
  transform: rotate(180deg);
}

.sortOrderBtn.desc svg {
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .filtersContainer {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-lg);
  }

  .filterGroup {
    justify-content: center;
  }
}
</style>
