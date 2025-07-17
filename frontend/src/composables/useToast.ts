import { ref, reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

const toasts = ref<Toast[]>([])
let toastId = 0

export const useToast = () => {
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastId}`
    const newToast: Toast = {
      id,
      duration: 5000, // 5 segundos por padrão
      persistent: false,
      ...toast,
    }

    toasts.value.push(newToast)

    // Auto remove toast após duration (se não for persistent)
    if (!newToast.persistent && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  // Helpers para diferentes tipos de toast
  const showSuccess = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'success',
      title,
      message,
      ...options,
    })
  }

  const showError = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'error',
      title,
      message,
      duration: 7000, // Erros ficam mais tempo
      ...options,
    })
  }

  const showWarning = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'warning',
      title,
      message,
      ...options,
    })
  }

  const showInfo = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'info',
      title,
      message,
      ...options,
    })
  }

  return {
    toasts: toasts.value,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
