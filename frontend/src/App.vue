<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <Navbar />
  <main id="main-content" tabindex="-1">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
  <Footer />
</template>
