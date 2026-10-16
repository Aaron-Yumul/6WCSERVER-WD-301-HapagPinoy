<template>
  <svg class="success-mark" viewBox="0 0 52 52" aria-hidden="true" focusable="false">
    <circle class="ring" cx="26" cy="26" r="23" fill="none" stroke="#2f6b3f" stroke-width="3" />
    <path class="tick" d="M15 27 l8 8 l15 -17" fill="none" stroke="#2f6b3f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<style scoped>
.success-mark { width: 64px; height: 64px; margin-bottom: 1rem; }
.ring {
  stroke-dasharray: 145;
  stroke-dashoffset: 145;
  animation: draw 0.6s ease-out forwards;
}
.tick {
  stroke-dasharray: 36;
  stroke-dashoffset: 36;
  animation: draw 0.4s 0.45s ease-out forwards;
}
</style>
