<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getOpenStatus } from '../utils/hours'

defineProps({
  light: { type: Boolean, default: false },
})

const status = ref(getOpenStatus())
let timerId = null

onMounted(() => {
  timerId = setInterval(() => {
    status.value = getOpenStatus()
  }, 60000)
})

onUnmounted(() => clearInterval(timerId))
</script>

<template>
  <p class="status" :class="{ open: status.isOpen, light }" role="status">
    <span class="dot" aria-hidden="true"></span>
    {{ status.text }}
  </p>
</template>

<style scoped>
.status {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0;
  padding: 0.35rem 0.95rem 0.35rem 0.8rem;
  font-size: 0.88rem;
  font-weight: 500;
  border: 1px solid var(--beige);
  border-radius: 999px;
  background: var(--white);
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #9a8a78;
}
.open .dot {
  background: var(--success);
  animation: pulse-dot 2s ease-out infinite;
}
.light {
  background: rgba(248, 243, 234, 0.1);
  border-color: rgba(232, 220, 203, 0.35);
  color: var(--cream);
}
.light.open .dot { background: #7bd08f; }
</style>
