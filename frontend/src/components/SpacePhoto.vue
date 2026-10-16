<script setup>
import { ref } from 'vue'
import DishArt from './DishArt.vue'

defineProps({
  src: { type: String, default: '' },
  alt: { type: String, required: true },
  caption: { type: String, required: true },
  art: { type: String, default: 'main' },
})

const failed = ref(false)
</script>

<template>
  <figure class="space-photo">
    <img v-if="src && !failed" :src="src" :alt="alt" loading="lazy" @error="failed = true" />
    <div v-else class="placeholder tile-sand" role="img" :aria-label="`${caption} (photo placeholder)`">
      <DishArt :kind="art" />
    </div>
    <figcaption>{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.space-photo {
  position: relative;
  margin: 0;
  height: 100%;
  min-height: 220px;
  overflow: hidden;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  background: var(--beige);
}
img,
.placeholder {
  width: 100%;
  height: 100%;
  min-height: inherit;
  object-fit: cover;
  transition: transform 0.7s var(--ease);
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 2rem 3.5rem;
}
.space-photo:hover img,
.space-photo:hover .placeholder { transform: scale(1.05); }
figcaption {
  position: absolute;
  left: 0.9rem;
  bottom: 0.9rem;
  padding: 0.3rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 999px;
  background: var(--cream);
  color: var(--brown);
}
</style>
