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
  font-family: 'Encode Sans Semi Expanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f8fafc;
  color: #334155;
  line-height: 1.6;
}

button {
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #695CCD;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #7c3aed;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #475569;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #cbd5e1;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.btn-small {
  padding: 8px 16px;
  font-size: 0.875rem;
}

input, textarea, select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #695CCD;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.container {
  max-width: 1860px;
  padding: 0 2rem;
  margin: 0 auto;
}

mark {
  background-color: #fef3c7;
  color: #92400e;
  padding: 0 2px;
  border-radius: 2px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.error {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}
</style>
