<template>
  <teleport to="body">
    <div :class="$style.toastContainer">
      <transition-group name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            $style.toast,
            $style[`toast--${toast.type}`]
          ]"
          @click="removeToast(toast.id)"
        >
          <div :class="$style.iconContainer">
            <svg
              v-if="toast.type === 'success'"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <svg
              v-else-if="toast.type === 'error'"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <svg
              v-else-if="toast.type === 'warning'"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 003.64 21H20.36A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 16V12M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <div :class="$style.content">
            <h4 :class="$style.title">{{ toast.title }}</h4>
            <p v-if="toast.message" :class="$style.message">{{ toast.message }}</p>
          </div>

          <button :class="$style.closeBtn" @click.stop="removeToast(toast.id)" type="button">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div
            v-if="!toast.persistent && toast.duration"
            :class="$style.progressBar"
            :style="{ animationDuration: `${toast.duration}ms` }"
          ></div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style module>
.toastContainer {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: calc(var(--z-index-modal) + 1);
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: 400px;
  width: 100%;
}

.toast {
  position: relative;
  background: var(--color-background-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  pointer-events: auto;
  cursor: pointer;
  border-left: 4px solid;
  overflow: hidden;
  transition: var(--transition-all);
  transform: translateX(0);
}

.toast:hover {
  transform: translateX(-4px);
  box-shadow: var(--shadow-xl);
}

/* Tipos de toast */
.toast--success {
  border-left-color: var(--color-success);
  background: linear-gradient(135deg, #f0fdf4 0%, var(--color-background-primary) 100%);
}

.toast--error {
  border-left-color: var(--color-error);
  background: linear-gradient(135deg, var(--color-error-bg) 0%, var(--color-background-primary) 100%);
}

.toast--warning {
  border-left-color: var(--color-warning);
  background: linear-gradient(135deg, var(--color-warning-bg) 0%, var(--color-background-primary) 100%);
}

.toast--info {
  border-left-color: var(--color-primary);
  background: linear-gradient(135deg, #f8fafc 0%, var(--color-background-primary) 100%);
}

.iconContainer {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.toast--success .iconContainer {
  background: var(--color-success);
  color: var(--color-text-white);
}

.toast--error .iconContainer {
  background: var(--color-error);
  color: var(--color-text-white);
}

.toast--warning .iconContainer {
  background: var(--color-warning);
  color: var(--color-text-white);
}

.toast--info .iconContainer {
  background: var(--color-primary);
  color: var(--color-text-white);
}

.content {
  flex: 1;
  min-width: 0;
}

.title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xs);
  line-height: var(--line-height-tight);
}

.message {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin: 0;
  line-height: var(--line-height-normal);
  word-wrap: break-word;
}

.closeBtn {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: var(--spacing-xs);
  cursor: pointer;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  transition: var(--transition-all);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.closeBtn:hover {
  background: var(--color-background-muted);
  color: var(--color-text-secondary);
}

.progressBar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  animation: progress linear forwards;
  opacity: 0.6;
}

.toast--success .progressBar {
  background: var(--color-success);
}

.toast--error .progressBar {
  background: var(--color-error);
}

.toast--warning .progressBar {
  background: var(--color-warning);
}

.toast--info .progressBar {
  background: var(--color-primary);
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Transições */
:global(.toast-enter-active) {
  transition: all 0.3s ease-out;
}

:global(.toast-leave-active) {
  transition: all 0.3s ease-in;
}

:global(.toast-enter-from) {
  opacity: 0;
  transform: translateX(100%);
}

:global(.toast-leave-to) {
  opacity: 0;
  transform: translateX(100%);
}

:global(.toast-move) {
  transition: transform 0.3s ease;
}

/* Responsividade */
@media (max-width: 640px) {
  .toastContainer {
    top: var(--spacing-md);
    right: var(--spacing-md);
    left: var(--spacing-md);
    max-width: none;
  }

  .toast {
    padding: var(--spacing-md);
  }

  .title {
    font-size: var(--font-size-xs);
  }

  .message {
    font-size: 11px;
  }
}
</style>
