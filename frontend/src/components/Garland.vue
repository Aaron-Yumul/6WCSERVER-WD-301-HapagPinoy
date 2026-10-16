<script setup>
// Banderitas (fiesta bunting) that hang from the top of the nearest positioned parent.
// Same artwork and sway as the home hero, shared so every page header matches.
defineProps({
  tone: { type: String, default: 'light' }, // 'light' (dark string) or 'dark' (cream string)
})
</script>

<template>
  <div class="garlands" :class="`garlands--${tone}`" aria-hidden="true"><i class="garland"></i></div>
</template>

<style scoped>
.garlands {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  z-index: 1;
  pointer-events: none;
}
.garland {
  position: absolute;
  top: 0;
  left: calc((100% - max(100%, 700px)) / 2);
  width: max(100%, 700px);
  aspect-ratio: 1440 / 72;
  background: center top / 100% 100% no-repeat;
  transform-origin: 50% 0;
  will-change: transform;
  animation: bunting-sway 8s ease-in-out infinite alternate;
}
.garlands--light .garland { background-image: url('../assets/garland-light.svg'); }
.garlands--dark .garland { background-image: url('../assets/garland-dark.svg'); }
@keyframes bunting-sway {
  from { transform: rotate(-0.25deg); }
  to { transform: rotate(0.25deg); }
}
</style>
