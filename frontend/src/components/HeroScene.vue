<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import adoboImg from '../assets/hero/adobo.webp'
import tsokolateImg from '../assets/hero/tsokolate.webp'
import flanImg from '../assets/hero/lecheflan.webp'

const scene = ref(null)

// Pointer parallax. Each layer carries data-depth (px of travel). We write
// transforms straight to those few elements inside one rAF loop, so there is no
// CSS-variable cascade, no 3D perspective and no repaint: it stays on the GPU.
let layers = []
let frame = 0
let observer = null
let inView = true
let enabled = false
const target = { x: 0, y: 0 }
const current = { x: 0, y: 0 }

function tick() {
  frame = 0
  current.x += (target.x - current.x) * 0.1
  current.y += (target.y - current.y) * 0.1
  for (const layer of layers) {
    layer.el.style.transform = `translate3d(${(current.x * layer.k).toFixed(2)}px, ${(current.y * layer.k).toFixed(2)}px, 0)`
  }
  if (Math.abs(target.x - current.x) > 0.01 || Math.abs(target.y - current.y) > 0.01) {
    frame = requestAnimationFrame(tick)
  }
}

function queue() {
  if (!frame) frame = requestAnimationFrame(tick)
}

function onPointerMove(event) {
  if (!enabled || !inView || event.pointerType !== 'mouse') return
  target.x = (event.clientX / window.innerWidth - 0.5) * 2
  target.y = (event.clientY / window.innerHeight - 0.5) * 2
  queue()
}

function reset() {
  target.x = 0
  target.y = 0
  queue()
}

onMounted(() => {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  enabled = canHover && !reduceMotion
  if (!enabled || !scene.value) return

  layers = [...scene.value.querySelectorAll('[data-depth]')].map((el) => ({
    el,
    k: Number(el.dataset.depth),
  }))
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', reset)
  observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    if (!inView) reset()
  })
  observer.observe(scene.value)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove)
  document.documentElement.removeEventListener('pointerleave', reset)
  if (observer) observer.disconnect()
  if (frame) cancelAnimationFrame(frame)
})
</script>

<template>
  <div ref="scene" class="scene" aria-hidden="true">
    <div class="layer" data-depth="-9">
      <div class="disc"></div>
      <div class="ring"></div>
      <div class="ring ring--inner"></div>
    </div>

    <div class="layer" data-depth="12">
      <div class="item adobo" style="--x: -60px; --y: -60px; --delay: 150ms">
        <span class="contact" style="--dur: 8s"></span>
        <div class="floater" style="--dur: 8s; --r: -3deg">
          <img class="dish-photo" :src="adoboImg" width="722" height="722" alt="" decoding="async" fetchpriority="high" draggable="false" />
        </div>
      </div>
    </div>

    <div class="layer" data-depth="26">
      <div class="item tsokolate" style="--x: 80px; --y: 40px; --delay: 450ms">
        <span class="contact" style="--dur: 6.5s"></span>
        <div class="floater" style="--dur: 6.5s; --r: 4deg">
          <img class="dish-photo" :src="tsokolateImg" width="446" height="484" alt="" decoding="async" draggable="false" />
        </div>
      </div>
    </div>

    <div class="layer" data-depth="18">
      <div class="item flan" style="--x: -50px; --y: 70px; --delay: 750ms">
        <span class="contact" style="--dur: 7.5s"></span>
        <div class="floater" style="--dur: 7.5s; --r: -2deg">
          <img class="dish-photo" :src="flanImg" width="441" height="436" alt="" decoding="async" draggable="false" />
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.scene {
  position: relative;
  width: 100%;
  max-width: 520px;
  aspect-ratio: 1;
  margin-inline: auto;
}

/* Parallax wrapper: transformed by script only, never animated by CSS */
.layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  will-change: transform;
}

.disc {
  position: absolute;
  inset: 4%;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 28%, rgba(255, 255, 255, 0.55), transparent 55%),
    var(--beige);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.6),
    0 40px 70px -28px rgba(59, 48, 40, 0.45);
  animation: pop 0.9s var(--ease) both;
}
.ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px dashed var(--terracotta);
  opacity: 0.55;
  will-change: transform;
  animation: spin 70s linear infinite;
}
.ring--inner {
  inset: 11%;
  opacity: 0.3;
  border-style: dotted;
  will-change: auto;
  animation: none;
}

.item {
  position: absolute;
  animation: scene-in 1s var(--ease) both;
  animation-delay: var(--delay);
}
.floater {
  width: 100%;
  animation: float var(--dur) ease-in-out infinite;
  will-change: transform;
}

/* Real food photos (transparent cut-outs). The shadow sits on the static
   image, never on the element that is animating. */
.dish-photo {
  display: block;
  width: 100%;
  height: auto;
  max-width: none;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0 12px 14px rgba(59, 48, 40, 0.26));
}

/* Soft table shadow that breathes with each plate (gradient, no blur filter) */
.contact {
  position: absolute;
  left: 16%;
  right: 16%;
  bottom: -3%;
  height: 10%;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(59, 48, 40, 0.4), rgba(59, 48, 40, 0) 70%);
  animation: contact var(--dur) ease-in-out infinite;
}

.adobo { width: 56%; left: 3%; top: 4%; }
.tsokolate { width: 36%; right: 2%; top: 36%; }
.flan { width: 38%; left: 20%; bottom: 1%; }

@keyframes scene-in {
  from { opacity: 0; transform: translate(var(--x), var(--y)) scale(0.8) rotate(-24deg); }
  to { opacity: 1; transform: none; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes contact {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(0.82); opacity: 0.55; }
}
@media (max-width: 860px) {
  .scene { max-width: 400px; }
}

@media (max-width: 480px) {
  .scene { max-width: min(100%, 340px); }
}

@media (prefers-reduced-motion: reduce) {
  .layer { will-change: auto; }
}
</style>
