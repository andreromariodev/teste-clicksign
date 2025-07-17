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

let searchTimeout: number | null = null

watch(() => props.modelValue, (newValue) => {
  searchTerm.value = newValue
})

const onSearch = () => {
  emit('update:modelValue', searchTerm.value)

  // Debounce search
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

// Close history when clicking outside
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
  gap: 0.5rem;
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
  left: 12px;
  color: #94a3b8;
  z-index: 1;
}

.input {
  width: 100%;
  padding: 12px 44px 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.clearBtn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.clearBtn:hover {
  color: #64748b;
}

.historyBtn {
  background: #f8fafc;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.historyBtn:hover,
.historyBtn.active {
  background: #8b5cf6;
  border-color: #8b5cf6;
  color: white;
}

.historyDropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  margin-top: 4px;
}

.historyHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.clearHistoryBtn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clearHistoryBtn:hover {
  background: #f8fafc;
  color: #374151;
}

.historyList {
  list-style: none;
  padding: 0;
  margin: 0;
}

.historyItem {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #64748b;
  transition: all 0.2s ease;
}

.historyItem:hover {
  background: #f8fafc;
  color: #374151;
}

.historyItem:last-child {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.historyItem svg {
  flex-shrink: 0;
}
</style>
