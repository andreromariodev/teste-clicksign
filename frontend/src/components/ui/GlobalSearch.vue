<template>
  <div :class="$style.searchContainer">
    <!-- Botão para abrir a busca -->
    <button
      @click="toggleSearch"
      :class="[$style.searchButton, { [$style.active]: isOpen }]"
      title="Buscar projetos"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2"/>
      </svg>
    </button>

    <!-- Modal/Dropdown de busca -->
    <Teleport to="body">
      <div v-if="isOpen" :class="$style.searchOverlay" @click="closeSearch">
        <div :class="$style.searchModal" @click.stop>
          <div :class="$style.searchContent">
            <!-- Input de busca -->
            <div :class="$style.searchInputContainer">
              <div :class="$style.searchInput">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <input
                  ref="searchInput"
                  v-model="searchTerm"
                  type="text"
                  placeholder="Digite o nome do projeto... (mínimo 3 caracteres)"
                  :class="$style.input"
                  @input="onSearchInput"
                  @keydown.enter="() => performSearch()"
                  @keydown.escape="closeSearch"
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
            </div>

            <!-- Histórico de buscas -->
            <div v-if="searchHistory.length > 0" :class="$style.historySection">
              <div :class="$style.historyHeader">
                <span :class="$style.historyTitle">Buscas recentes</span>
                <button @click="clearHistory" :class="$style.clearHistoryBtn">
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L16 16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span :class="$style.historyTerm">{{ term }}</span>
                  <button
                    @click.stop="removeFromHistory(term)"
                    :class="$style.removeHistoryBtn"
                    title="Remover do histórico"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                </li>
              </ul>
            </div>

            <!-- Dica quando não há histórico -->
            <div v-else :class="$style.emptyHistory">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <p>Suas buscas recentes aparecerão aqui</p>
            </div>

            <!-- Ações do modal -->
            <div :class="$style.searchActions">
              <button
                @click="() => performSearch()"
                :class="[$style.searchBtn, { [$style.disabled]: !canSearch }]"
                :disabled="!canSearch"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSearchHistory } from '@/composables/useSearchHistory'

const router = useRouter()
const route = useRoute()
const { searchHistory, addToHistory, clearHistory, removeFromHistory } = useSearchHistory()

const isOpen = ref(false)
const searchTerm = ref('')
const searchInput = ref<HTMLInputElement>()

let searchTimeout: number | null = null

const canSearch = computed(() => searchTerm.value.trim().length >= 3)

const toggleSearch = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const closeSearch = () => {
  isOpen.value = false
  searchTerm.value = ''
}

const clearSearch = () => {
  searchTerm.value = ''
  searchInput.value?.focus()
}

const onSearchInput = () => {
  // Debounce a busca automática se estiver na página de projetos
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
}

const performSearch = (addToHistoryFlag = true) => {
  if (!canSearch.value) return

  const term = searchTerm.value.trim()

  if (addToHistoryFlag) {
    addToHistory(term)
  }

  // Se não estiver na página de projetos, navegar para lá
  if (route.name !== 'projects') {
    router.push({ name: 'projects', query: { search: term } })
  } else {
    // Se já estiver na página de projetos, atualizar a query
    router.push({
      name: 'projects',
      query: {
        ...route.query,
        search: term,
        page: '1' // Reset para primeira página
      }
    })
  }

  closeSearch()
}

const selectFromHistory = (term: string) => {
  searchTerm.value = term
  performSearch()
}

// Fechar modal com ESC
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeSearch()
  }
}

// Adicionar listener para ESC
watch(isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})
</script>

<style module>
.searchContainer {
  position: relative;
}

.searchContent {
  padding: 24px;
}

.searchButton {
  background: transparent;
  border-radius: 8px;
  padding: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.searchButton:hover,
.searchButton.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.searchOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
}

.searchModal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 95vw;
  max-height: 80vh;
  overflow: hidden;
  margin: 0 16px;
}

.searchHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.searchTitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.closeButton {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.closeButton:hover {
  color: #374151;
  background: #f3f4f6;
}

.searchInputContainer {
  margin-bottom: 24px;
}

.searchInput {
  position: relative;
  display: flex;
  align-items: center;
  svg {
    color: #695CCD;
  }
}

.searchInput svg:first-child {
  position: absolute;
  left: 12px;
  color: #6b7280;
  z-index: 1;
}

.input {
  width: 100%;
  padding: 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #695ccd;
  box-shadow: 0 0 0 3px rgba(105, 92, 205, 0.1);
}

.clearBtn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clearBtn:hover {
  color: #374151;
  background: #f3f4f6;
}

.historySection {
  margin-bottom: 24px;
}

.historyHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.historyTitle {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.clearHistoryBtn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clearHistoryBtn:hover {
  background: #f3f4f6;
  color: #374151;
}

.historyList {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.historyItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  color: #374151;
  transition: all 0.2s ease;
  border-bottom: 1px solid #e5e7eb;
}

.historyItem:last-child {
  border-bottom: none;
}

.historyItem:hover {
  background: #f9fafb;
}

.historyTerm {
  flex: 1;
  font-size: 0.875rem;
}

.removeHistoryBtn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  opacity: 0;
}

.historyItem:hover .removeHistoryBtn {
  opacity: 1;
}

.removeHistoryBtn:hover {
  color: #ef4444;
  background: #fef2f2;
}

.emptyHistory {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.emptyHistory svg {
  margin-bottom: 16px;
}

.emptyHistory p {
  margin: 0;
  font-size: 0.875rem;
}

.searchActions {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.searchBtn {
  background: #695ccd;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.searchBtn:hover:not(.disabled) {
  background: #5b4bc4;
}

.searchBtn.disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .searchOverlay {
    padding-top: 20px;
    align-items: stretch;
  }

  .searchModal {
    margin: 16px;
    max-height: calc(100vh - 32px);
  }

  .searchHeader {
    padding: 16px;
  }

  .searchContent {
    padding: 16px;
  }
}
</style>
