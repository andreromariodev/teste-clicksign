import { ref, watch } from 'vue'

const SEARCH_HISTORY_KEY = 'project-search-history'
const MAX_HISTORY_ITEMS = 5

export function useSearchHistory() {
  const searchHistory = ref<string[]>([])

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
      if (stored) {
        searchHistory.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de busca:', error)
      searchHistory.value = []
    }
  }

  const saveHistory = () => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory.value))
    } catch (error) {
      console.error('Erro ao salvar histórico de busca:', error)
    }
  }

  const addToHistory = (term: string) => {
    if (!term.trim() || term.length < 3) return

    const cleanTerm = term.trim().toLowerCase()

    const index = searchHistory.value.findIndex(item => item.toLowerCase() === cleanTerm)
    if (index > -1) {
      searchHistory.value.splice(index, 1)
    }

    searchHistory.value.unshift(term.trim())

    if (searchHistory.value.length > MAX_HISTORY_ITEMS) {
      searchHistory.value = searchHistory.value.slice(0, MAX_HISTORY_ITEMS)
    }

    saveHistory()
  }

  const clearHistory = () => {
    searchHistory.value = []
    saveHistory()
  }

  const removeFromHistory = (term: string) => {
    const index = searchHistory.value.findIndex(item => item.toLowerCase() === term.toLowerCase())
    if (index > -1) {
      searchHistory.value.splice(index, 1)
      saveHistory()
    }
  }

  watch(searchHistory, saveHistory, { deep: true })

  loadHistory()

  return {
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
    loadHistory
  }
}
