<script setup>
import { computed } from 'vue'
import DishArt from './DishArt.vue'
import Garland from './Garland.vue'

const props = defineProps({
  eyebrow: { type: String, default: '' }, // small Filipino label above the title
  title: { type: String, required: true },
  accent: { type: String, default: '' }, // part of the title shown in chili red with a gold squiggle
  text: { type: String, default: '' },
  art: { type: String, default: 'main' },
  image: { type: String, default: '' }, // photo (transparent WebP) shown instead of the DishArt illustration
  image2: { type: String, default: '' }, // optional smaller second photo that sits on the ring
  tone: { type: String, default: '' },
})

const titleParts = computed(() => {
  const index = props.accent ? props.title.indexOf(props.accent) : -1
  if (index === -1) return { before: props.title, accent: '', after: '' }
  return {
    before: props.title.slice(0, index),
    accent: props.accent,
    after: props.title.slice(index + props.accent.length),
  }
})
</script>

<template>
  <section class="page-header">
    <Garland tone="light" />
    <div class="container header-inner">
      <div class="header-text">
        <p v-if="eyebrow" class="kicker rise" style="--d: 0ms">{{ eyebrow }}</p>
        <h1 class="rise" style="--d: 80ms">{{ titleParts.before }}<span v-if="titleParts.accent" class="accent">{{ titleParts.accent }}<svg class="squiggle" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M2 7 C 22 1, 42 13, 62 7 S 102 1, 122 7 S 162 13, 198 6" /></svg></span>{{ titleParts.after }}</h1>
        <p v-if="text" class="lead rise" style="--d: 160ms">{{ text }}</p>
      </div>
      <div class="header-art" aria-hidden="true">
        <div class="art-wrap">
          <span class="art-plate"></span>
          <div class="art-dish">
            <img v-if="image" class="art-photo" :src="image" width="720" height="720" alt="" decoding="async" draggable="false" />
            <DishArt v-else :kind="art" :tone="tone" />
          </div>
          <div v-if="image && image2" class="art-side">
            <img class="art-photo" :src="image2" width="720" height="720" alt="" loading="lazy" decoding="async" draggable="false" />
          </div>
        </div>
      </div>
    </div>
    <div class="banig-strip header-trim" aria-hidden="true"></div>
  </section>
</template>

<style scoped>
.page-header {
  position: relative;
  background: var(--beige);
  overflow: hidden;
}
/* Faint woven-mat zigzag, fading out behind the text so it stays easy to read */
.page-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(217, 164, 65, 0.18) 25%, transparent 25%) -18px 0 / 36px 36px,
    linear-gradient(225deg, rgba(217, 164, 65, 0.18) 25%, transparent 25%) -18px 0 / 36px 36px,
    linear-gradient(315deg, rgba(122, 41, 37, 0.08) 25%, transparent 25%) 0 0 / 36px 36px,
    linear-gradient(45deg, rgba(122, 41, 37, 0.08) 25%, transparent 25%) 0 0 / 36px 36px;
  -webkit-mask-image: linear-gradient(100deg, transparent 38%, #000 100%);
  mask-image: linear-gradient(100deg, transparent 38%, #000 100%);
  pointer-events: none;
}
.header-trim {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}

.header-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding-block: 5.25rem 3.75rem;
}
.header-text { max-width: 600px; }
.header-text .kicker { margin-bottom: 0.9rem; }
.header-text h1 { margin-bottom: 0.9rem; }
.lead { font-size: 1.05rem; margin: 0; }

.accent {
  position: relative;
  display: inline-block;
  max-width: 100%;
  color: var(--terracotta);
}
.squiggle {
  position: absolute;
  left: 0;
  bottom: -0.08em;
  width: 100%;
  height: 0.2em;
  overflow: visible;
  transform-origin: left center;
  animation: squiggle-in 0.9s var(--ease) 0.7s both;
}
.squiggle path {
  fill: none;
  stroke: var(--gold);
  stroke-width: 3;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.header-art { flex: none; }
.art-wrap {
  position: relative;
  width: 190px;
  height: 190px;
}
.art-plate {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: var(--cream);
  box-shadow: 0 14px 28px rgba(59, 48, 40, 0.18), inset 0 0 0 6px rgba(255, 255, 255, 0.55);
}
.art-plate::after {
  content: '';
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  border: 1.5px dashed rgba(122, 41, 37, 0.5);
  animation: ring-turn 40s linear infinite;
}
.art-dish {
  position: absolute;
  inset: 11%;
  filter: drop-shadow(0 10px 12px rgba(59, 48, 40, 0.25));
  animation: float 7s ease-in-out infinite, spin-in 1s var(--ease) both;
}
/* Photo mode: the dish is bigger than the disc and pops out of it */
.art-photo { display: block; width: 100%; height: 100%; object-fit: contain; user-select: none; }
.art-dish:has(.art-photo) { inset: -9%; animation: float 7s ease-in-out infinite; }
.art-side {
  position: absolute;
  left: -22%;
  bottom: -14%;
  width: 46%;
  height: 46%;
  filter: drop-shadow(0 8px 10px rgba(59, 48, 40, 0.3));
  animation: float 8.5s ease-in-out -3s infinite;
}
@keyframes squiggle-in {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes ring-turn {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .header-inner { padding-block: 3.75rem 2.5rem; gap: 1.25rem; }
  .art-wrap { width: 96px; height: 96px; }
  .art-plate::after { inset: -8px; }
  .art-side { left: -26%; bottom: -18%; }
}

@media (prefers-reduced-motion: reduce) {
  .art-plate::after,
  .art-dish,
  .art-side { animation: none; }
}
</style>
