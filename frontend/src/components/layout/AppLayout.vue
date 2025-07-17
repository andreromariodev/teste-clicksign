<template>
  <div>
    <header :class="$style.header">
      <div class="container">
        <div :class="$style.headerContent">
          <div :class="$style.logo">
            <router-link to="/">
              <img :src="logoUrl" :alt="'Logo Gerenciador de Projetos'" :class="$style.logoImg" />
            </router-link>
          </div>
          <nav :class="$style.nav">
            <router-link to="/projects/new" :class="[$style.navLink, $style.btnPrimary]">
              Novo Projeto
            </router-link>
          </nav>
        </div>
      </div>
    </header>
    <div :class="$style.layout">

      <main :class="$style.main">
        <div class="container">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoUrl from '@/assets/logo-projeto-sg.svg'
</script>

<style module>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #1C1930;
  border-bottom: 1px solid var(--color-border-primary);
  position: sticky;
  top: 0;
  z-index: 100;
}

.headerContent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) 0;
}

.logo h1 {
  color: var(--color-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.nav {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
}

.navLink {
  color: var(--color-text-light);
  text-decoration: none;
  padding: var(--button-padding-sm);
  border-radius: var(--button-radius);
  transition: var(--transition-all);
  font-weight: var(--font-weight-medium);
}

.navLink:hover {
  color: var(--color-text-secondary);
  background-color: var(--color-background-secondary);
}

.navLink.btnPrimary {
  background-color: var(--color-primary);
  color: var(--color-text-white);
}

.navLink.btnPrimary:hover {
  background-color: var(--color-primary-dark);
}

.main {
  flex: 1;
  padding: var(--spacing-2xl) 0;
}

.logoImg {
  width: 193px;
}
</style>
