<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  width: 100%;
}

body {
  font-family: var(--font-family-primary);
  background-color: var(--color-background-secondary);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

button {
  border: none;
  border-radius: var(--button-radius);
  padding: var(--button-padding-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
  font-family: inherit;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-white);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.btn-secondary {
  background-color: var(--color-background-muted);
  color: var(--color-text-secondary);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-background-secondary);
}

.btn-danger {
  background-color: var(--color-error);
  color: var(--color-text-white);
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--color-error-text);
}

.btn-small {
  padding: var(--button-padding-sm);
  font-size: var(--font-size-sm);
}

input, textarea, select {
  border: var(--input-border);
  border-radius: var(--input-radius);
  padding: var(--input-padding);
  font-family: inherit;
  font-size: var(--font-size-base);
  transition: var(--transition-normal);
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border: var(--input-border-focus);
  box-shadow: var(--shadow-focus);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.form-error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.card {
  background: var(--color-background-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.container {
  max-width: 1860px;
  padding: 0 var(--spacing-2xl);
  margin: 0 auto;
}

mark {
  background-color: var(--color-warning-bg);
  color: var(--color-warning-text);
  padding: 0 var(--spacing-xs);
  border-radius: var(--radius-xs);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-2xl);
}

.error {
  background-color: var(--color-error-bg);
  color: var(--color-error-text);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin: var(--spacing-lg) 0;
}
</style>
