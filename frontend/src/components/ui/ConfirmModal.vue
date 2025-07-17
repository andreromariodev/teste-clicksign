<template>
  <teleport to="body">
    <div v-if="show" :class="$style.overlay" @click="onCancel">
      <div :class="$style.modal" @click.stop>
        <!-- Ícone de lixeira no topo -->
        <div :class="$style.iconContainer">
          <div :class="$style.trashIcon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 11V17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 11V17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- Título centralizado -->
        <div :class="$style.header">
          <h3 :class="$style.title">{{ title }}</h3>
        </div>

        <!-- Linha horizontal -->
        <div :class="$style.divider"></div>

        <!-- Conteúdo -->
        <div :class="$style.body">
          <p :class="$style.description">{{ description }}</p>
          <p :class="$style.projectName">{{ projectName }}</p>
        </div>

        <!-- Botões -->
        <div :class="$style.footer">
          <button
            @click="onCancel"
            :class="[$style.btn, $style.btnSecondary]"
          >
            {{ cancelText }}
          </button>
          <button
            @click="onConfirm"
            :class="[$style.btn, $style.btnPrimary]"
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
  description?: string
  projectName?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Remover projeto',
  description: 'Essa ação removerá definitivamente o projeto:',
  projectName: '',
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
  background: rgba(24, 24, 24, 0.898);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
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
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 480px;
  position: relative;
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

.iconContainer {
  display: flex;
  justify-content: center;
  padding-top: 32px;
  margin-bottom: 24px;
  margin: 0 0 -50px;
  transform: translateY(-70px);
}

.trashIcon {
  width: 64px;
  height: 64px;
  background: #695CCD;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 4px 0px #00000040;
}

.header {
  text-align: center;
  padding: 0 32px;
  margin-bottom: 24px;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1F1283;
  margin: 0;
}

.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0 32px 24px;
}

.body {
  padding: 0 32px;
  text-align: center;
  margin-bottom: 32px;
}

.description {
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.projectName {
  font-size: 1.5rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

.footer {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 0 32px 32px;
}

.btn {
  width: 100%;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 400;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btnSecondary {
  background: transparent;
  color: #695CCD;
  border: 1px solid #695CCD;
}

.btnSecondary:hover:not(:disabled) {
  background: rgba(105, 92, 205, 0.1);
}

.btnPrimary {
  background: #695CCD;
  color: white;
  border: 1px solid #695CCD;
}

.btnPrimary:hover:not(:disabled) {
  background: #5b4bc4;
  border-color: #5b4bc4;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .modal {
    margin: 16px;
    max-width: calc(100vw - 32px);
  }

  .iconContainer,
  .header,
  .divider,
  .body,
  .footer {
    padding-left: 24px;
    padding-right: 24px;
  }

  .divider {
    margin-left: 24px;
    margin-right: 24px;
  }
}
</style>
