<template>
  <div :class="$style.searchContainer">
    <div :class="$style.searchInputContainer">
      <div :class="$style.searchInput">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2"/>
        </svg>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar projetos... (mínimo 3 caracteres)"
          :class="$style.input"
          @input="onSearch"
        />
        <button
          v-if="searchTerm"
          @click="clearSearch"
          :class="$style.clearBtn"
          title="Limpar busca"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>

      <button
        v-if="searchHistory.length > 0"
        @click="toggleHistory"
        :class="[$style.historyBtn, { [$style.active]: showHistory }]"
        title="Histórico de busca"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8V12L16 16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>

    <div v-if="showHistory && searchHistory.length > 0" :class="$style.historyDropdown">
      <div :class="$style.historyHeader">
        <span>Buscas recentes</span>
        <button @click="onClearHistory" :class="$style.clearHistoryBtn">
          Limpar histórico
        </button>
      </div>
      <ul :class="$style.historyList">
        <li
          v-for="term in searchHistory"
          :key="term"
          :class="$style.historyItem"
          @click="selectFromHistory(term)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L16 16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          {{ term }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
  searchHistory: string[]
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
  (e: 'clear-history'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchTerm = ref(props.modelValue)
const showHistory = ref(false)

let searchTimeout: NodeJS.Timeout | null = null

watch(() => props.modelValue, (newValue) => {
  searchTerm.value = newValue
})

const onSearch = () => {
  emit('update:modelValue', searchTerm.value)

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    if (searchTerm.value.length >= 3 || searchTerm.value.length === 0) {
      emit('search', searchTerm.value)
    }
  }, 300)
}

const clearSearch = () => {
  searchTerm.value = ''
  emit('update:modelValue', '')
  emit('search', '')
  showHistory.value = false
}

const toggleHistory = () => {
  showHistory.value = !showHistory.value
}

const selectFromHistory = (term: string) => {
  searchTerm.value = term
  emit('update:modelValue', term)
  emit('search', term)
  showHistory.value = false
}

const onClearHistory = () => {
  emit('clear-history')
  showHistory.value = false
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('[data-search-container]')) {
    showHistory.value = false
  }
}

watch(showHistory, (show) => {
  if (show) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style module>
.searchContainer {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.searchInputContainer {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.searchInput {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.searchInput svg:first-child {
  position: absolute;
  left: var(--spacing-md);
  color: var(--color-text-light);
  z-index: 1;
}

.input {
  width: 100%;
  padding: var(--spacing-md) 44px;
  border: var(--input-border);
  border-radius: var(--input-radius);
  font-size: var(--font-size-sm);
  transition: var(--transition-all);
}

.input:focus {
  outline: none;
  border: var(--input-border-focus);
  box-shadow: var(--shadow-focus);
}

.clearBtn {
  position: absolute;
  right: var(--spacing-sm);
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal);
}

.clearBtn:hover {
  color: var(--color-text-secondary);
}

.historyBtn {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  color: var(--color-text-light);
  transition: var(--transition-all);
  display: flex;
  align-items: center;
  justify-content: center;
}

.historyBtn:hover,
.historyBtn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-white);
}

.historyDropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  z-index: 100;
  margin-top: var(--spacing-xs);
}

.historyHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-background-muted);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.clearHistoryBtn {
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: var(--transition-all);
}

.clearHistoryBtn:hover {
  background: var(--color-background-secondary);
  color: var(--color-text-secondary);
}

.historyList {
  list-style: none;
  padding: 0;
  margin: 0;
}

.historyItem {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  transition: var(--transition-all);
}

.historyItem:hover {
  background: var(--color-background-secondary);
  color: var(--color-text-secondary);
}

.historyItem:last-child {
  border-bottom-left-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
}

.historyItem svg {
  flex-shrink: 0;
}
</style>
