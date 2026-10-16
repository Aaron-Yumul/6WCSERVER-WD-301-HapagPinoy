<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import logoImg from '../assets/logo.webp'

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Our Menu' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

const isOpen = ref(false)
const isScrolled = ref(false)
const route = useRoute()

watch(() => route.path, () => {
  isOpen.value = false
})

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function updateScrollState() {
  isScrolled.value = window.scrollY > 12
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollState)
})
</script>

<template>
  <header class="navbar" :class="{ scrolled: isScrolled }">
    <nav class="container navbar-inner" aria-label="Main navigation">
      <RouterLink to="/" class="logo" aria-label="HapagPinoy home">
        <img class="logo-img" :src="logoImg" alt="HapagPinoy" width="1165" height="208" decoding="async" />
      </RouterLink>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="isOpen"
        aria-controls="nav-links"
        @click="toggleMenu"
      >
        <span class="sr-only">{{ isOpen ? 'Close menu' : 'Open menu' }}</span>
        <span class="bar" :class="{ open: isOpen }" aria-hidden="true"></span>
      </button>

      <ul id="nav-links" class="nav-links" :class="{ open: isOpen }">
        <li v-for="link in links" :key="link.to">
          <RouterLink :to="link.to">{{ link.label }}</RouterLink>
        </li>
        <li class="nav-cta">
          <RouterLink to="/reservations" class="btn">Book a Table</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--cream);
  border-bottom: 1px solid transparent;
  transition: box-shadow 0.3s, border-color 0.3s, background 0.3s;
}
.navbar.scrolled {
  background: rgba(248, 241, 229, 0.94);
  backdrop-filter: blur(8px);
  border-bottom-color: var(--beige);
  box-shadow: 0 4px 18px rgba(59, 48, 40, 0.08);
}
.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--nav-height);
  transition: min-height 0.3s var(--ease);
}
.scrolled .navbar-inner { min-height: 58px; }

.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--brown);
  text-decoration: none;
}
.logo-img {
  display: block;
  height: 38px;
  width: auto;
  max-width: 62vw;
  transition: transform 0.6s var(--ease), height 0.3s var(--ease);
}
.scrolled .logo-img { height: 34px; }
.logo:hover .logo-img { transform: scale(1.03); }

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav-links a:not(.btn) {
  position: relative;
  display: block;
  padding: 0.5rem 0.85rem;
  color: var(--brown);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
}
.nav-links a:not(.btn)::after {
  content: '';
  position: absolute;
  left: 0.85rem;
  right: 0.85rem;
  bottom: 0.2rem;
  height: 2px;
  background: var(--terracotta);
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease);
}
.nav-links a:not(.btn):hover::after,
.nav-links a.router-link-exact-active:not(.btn)::after { transform: scaleX(1); }
.nav-links a.router-link-exact-active:not(.btn) { color: var(--terracotta-dark); }
.nav-cta { margin-left: 0.6rem; }
.nav-cta .btn { padding: 0.5rem 1.2rem; }

.menu-toggle {
  display: none;
  width: 44px;
  height: 44px;
  background: transparent;
  border: 1.5px solid var(--beige);
  border-radius: var(--radius);
  cursor: pointer;
  align-items: center;
  justify-content: center;
}
.bar,
.bar::before,
.bar::after {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--brown);
  border-radius: 2px;
  transition: transform 0.25s, background 0.25s;
}
.bar { position: relative; }
.bar::before,
.bar::after { content: ''; position: absolute; left: 0; }
.bar::before { top: -6px; }
.bar::after { top: 6px; }
.bar.open { background: transparent; }
.bar.open::before { transform: translateY(6px) rotate(45deg); }
.bar.open::after { transform: translateY(-6px) rotate(-45deg); }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (max-width: 860px) {
  .menu-toggle { display: inline-flex; }
  .nav-links {
    display: flex;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0.75rem 1rem 1.25rem;
    background: var(--cream);
    border-bottom: var(--border);
    box-shadow: var(--shadow-sm);
    visibility: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.25s, transform 0.25s var(--ease), visibility 0.25s;
  }
  .nav-links.open {
    visibility: visible;
    opacity: 1;
    transform: none;
  }
  .nav-links a:not(.btn) { padding: 0.8rem 0.75rem; }
  .nav-links a:not(.btn)::after { left: 0.75rem; right: auto; width: 2rem; }
  .nav-cta { margin: 0.5rem 0 0; }
  .nav-cta .btn { display: block; }
}
</style>
