export function useFormatting() {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateInput = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  const highlightText = (text: string, searchTerm: string): string => {
    if (!searchTerm || searchTerm.length < 3) return text

    const regex = new RegExp(`(${searchTerm})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  const getDaysUntilDeadline = (endDate: string): number => {
    const today = new Date()
    const deadline = new Date(endDate)
    const diffTime = deadline.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const isOverdue = (endDate: string): boolean => {
    return getDaysUntilDeadline(endDate) < 0
  }

  const isNearDeadline = (endDate: string, days: number = 7): boolean => {
    const daysUntil = getDaysUntilDeadline(endDate)
    return daysUntil <= days && daysUntil >= 0
  }

  const truncateText = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return {
    formatDate,
    formatDateInput,
    highlightText,
    getDaysUntilDeadline,
    isOverdue,
    isNearDeadline,
    truncateText
  }
}
