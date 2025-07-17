import { ref, watch } from 'vue'

const SEARCH_HISTORY_KEY = 'project-search-history'
const MAX_HISTORY_ITEMS = 5

export function useSearchHistory() {
  const searchHistory = ref<string[]>([])

  // Carrega o histórico do localStorage
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

  // Salva o histórico no localStorage
  const saveHistory = () => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory.value))
    } catch (error) {
      console.error('Erro ao salvar histórico de busca:', error)
    }
  }

  // Adiciona um termo ao histórico
  const addToHistory = (term: string) => {
    if (!term.trim() || term.length < 3) return

    const cleanTerm = term.trim().toLowerCase()

    // Remove o termo se já existir
    const index = searchHistory.value.findIndex(item => item.toLowerCase() === cleanTerm)
    if (index > -1) {
      searchHistory.value.splice(index, 1)
    }

    // Adiciona no início
    searchHistory.value.unshift(term.trim())

    // Mantém apenas os últimos 5 itens
    if (searchHistory.value.length > MAX_HISTORY_ITEMS) {
      searchHistory.value = searchHistory.value.slice(0, MAX_HISTORY_ITEMS)
    }

    saveHistory()
  }

  // Limpa todo o histórico
  const clearHistory = () => {
    searchHistory.value = []
    saveHistory()
  }

  // Remove um item específico do histórico
  const removeFromHistory = (term: string) => {
    const index = searchHistory.value.findIndex(item => item.toLowerCase() === term.toLowerCase())
    if (index > -1) {
      searchHistory.value.splice(index, 1)
      saveHistory()
    }
  }

  // Observa mudanças no histórico para salvar automaticamente
  watch(searchHistory, saveHistory, { deep: true })

  // Carrega o histórico ao inicializar
  loadHistory()

  return {
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
    loadHistory
  }
}
