<script setup>
import { ref, onMounted } from 'vue'
import { scheduleRows } from '../utils/hours'

const rows = scheduleRows()
const today = ref(-1)

onMounted(() => {
  today.value = new Date().getDay()
})
</script>

<template>
  <ul class="hours">
    <li v-for="row in rows" :key="row.label" :class="{ today: row.days.includes(today) }">
      <span class="day">
        {{ row.label }}
        <span v-if="row.days.includes(today)" class="today-tag">Today</span>
      </span>
      <span class="time">{{ row.hours }}</span>
    </li>
  </ul>
</template>

<style scoped>
.hours {
  list-style: none;
  margin: 0;
  padding: 0;
}
.hours li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding: 0.7rem 0.75rem;
  margin: 0 -0.75rem;
  border-bottom: 1px dashed rgba(59, 48, 40, 0.25);
  border-radius: 8px;
  transition: background 0.25s;
}
.hours li:last-child { border-bottom-color: transparent; }
.hours li.today { background: rgba(122, 41, 37, 0.14); }
.day { font-weight: 500; }
.time { white-space: nowrap; }
.today-tag {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.05rem 0.55rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 999px;
  background: var(--terracotta);
  color: var(--white);
  vertical-align: 1px;
}


@media (max-width: 420px) {
  .hours li { flex-direction: column; gap: 0.1rem; }
}
</style>
