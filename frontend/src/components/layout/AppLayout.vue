<template>
  <div>
    <header :class="$style.header">
      <div class="container">
        <div :class="$style.headerContent">
          <div :class="$style.logo">
            <h1>Gerenciador de Projetos</h1>
          </div>
          <nav :class="$style.nav">
            <router-link to="/" :class="$style.navLink">Projetos</router-link>
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

<style module>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.headerContent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo h1 {
  color: #8b5cf6;
  font-size: 1.5rem;
  font-weight: 700;
}

.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.navLink {
  color: #64748b;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.navLink:hover {
  color: #475569;
  background-color: #f8fafc;
}

.navLink.btnPrimary {
  background-color: #8b5cf6;
  color: white;
}

.navLink.btnPrimary:hover {
  background-color: #7c3aed;
}

.main {
  flex: 1;
  padding: 2rem 0;
}
</style>
