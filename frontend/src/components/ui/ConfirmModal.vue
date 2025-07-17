<template>
  <teleport to="body">
    <div v-if="show" :class="$style.overlay" @click="onCancel">
      <div :class="$style.modal" @click.stop>
        <div :class="$style.header">
          <h3 :class="$style.title">{{ title }}</h3>
          <button @click="onCancel" :class="$style.closeBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <div :class="$style.body">
          <div :class="$style.icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>

          <div :class="$style.content">
            <p :class="$style.message">{{ message }}</p>
            <p v-if="description" :class="$style.description">{{ description }}</p>
          </div>
        </div>

        <div :class="$style.footer">
          <button
            @click="onCancel"
            :class="[$style.btn, $style.btnSecondary]"
          >
            {{ cancelText }}
          </button>
          <button
            @click="onConfirm"
            :class="[$style.btn, $style.btnDanger]"
            :disabled="loading"
          >
            <span v-if="loading" :class="$style.spinner"></span>
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface Props {
  show: boolean
  title?: string
  message: string
  description?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmar ação',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  loading: false
})

const emit = defineEmits<Emits>()

const onConfirm = () => {
  if (!props.loading) {
    emit('confirm')
  }
}

const onCancel = () => {
  if (!props.loading) {
    emit('cancel')
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    onCancel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  if (props.show) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})

import { watch } from 'vue'
watch(() => props.show, (newShow) => {
  document.body.style.overflow = newShow ? 'hidden' : ''
})
</script>

<style module>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal);
  padding: var(--spacing-lg);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: var(--color-background-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 400px;
  width: 100%;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl) var(--spacing-xl) 0;
}

.title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin: 0;
}

.closeBtn {
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: var(--transition-normal);
}

.closeBtn:hover {
  color: var(--color-text-secondary);
}

.body {
  padding: var(--spacing-xl);
  text-align: center;
}

.icon {
  color: var(--color-warning);
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: center;
}

.content {
  text-align: left;
}

.message {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-sm);
}

.description {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
  line-height: var(--line-height-normal);
}

.footer {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  padding: 0 var(--spacing-xl) var(--spacing-xl);
}

.btn {
  padding: var(--button-padding-md);
  border-radius: var(--button-radius);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
  border: none;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 80px;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btnSecondary {
  background: var(--color-background-muted);
  color: var(--color-text-secondary);
}

.btnSecondary:hover:not(:disabled) {
  background: var(--color-background-secondary);
}

.btnDanger {
  background: var(--color-error);
  color: var(--color-text-white);
}

.btnDanger:hover:not(:disabled) {
  background: var(--color-error-text);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: var(--radius-round);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
