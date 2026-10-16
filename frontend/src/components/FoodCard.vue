<script setup>
import { computed, ref } from 'vue'
import DishArt from './DishArt.vue'
import { formatPeso, getArtForItem, getTileForCategory } from '../data/menuItems'
import { getNutrition } from '../data/dishDetails'
import { getDishPhoto } from '../data/dishPhotos'

const props = defineProps({
  item: { type: Object, required: true },
})

const photoFailed = ref(false)
const photo = computed(() => props.item.photo || getDishPhoto(props.item.slug))
const showPhoto = computed(() => photo.value && !photoFailed.value)
const tileClass = computed(() => `tile-${getTileForCategory(props.item.category)}`)
const art = computed(() => getArtForItem(props.item))
const nutrition = computed(() => getNutrition(props.item.details))
const emit = defineEmits(['open'])
</script>

<template>
  <article class="food-card">
    <div class="food-tile" :class="tileClass">
      <img
        v-if="showPhoto"
        class="food-photo"
        :src="photo"
        :alt="`${item.name}: ${item.description}`"
        width="720"
        height="720"
        loading="lazy"
        decoding="async"
        draggable="false"
        @error="photoFailed = true"
      />
      <div v-else class="food-art"><DishArt :kind="art" :tone="item.tone" /></div>
      <span v-if="item.badge" class="badge">{{ item.badge }}</span>
      <span class="price">{{ formatPeso(item.price) }}</span>
      <span class="peek" aria-hidden="true">
        View details
        <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </span>
    </div>
    <div class="food-body">
      <h3>
        <button type="button" class="open-details" :aria-label="`${item.name}: view details, servings and nutrition`" @click="emit('open', item)">{{ item.name }}</button>
      </h3>
      <p class="food-description">{{ item.description }}</p>
      <div class="food-meta">
        <p class="food-category">{{ item.category }}</p>
        <p v-if="nutrition" class="food-kcal">{{ nutrition.kcal < 5 ? '< 5' : nutrition.kcal }} kcal · {{ nutrition.serves[0] === nutrition.serves[1] ? (nutrition.serves[0] === 1 ? '1 serving' : `serves ${nutrition.serves[0]}`) : `serves ${nutrition.serves[0]}–${nutrition.serves[1]}` }}</p>
        <p v-if="item.origin" class="food-origin">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor" /></svg>
          <span class="visually-hidden">Originally from </span>{{ item.origin }}
        </p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.food-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--white);
  border: var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease);
}
.food-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow);
}

.food-tile {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 0;
  border: 0;
  border-bottom: var(--border);
}
.food-art {
  position: absolute;
  inset: 12% 22%;
  filter: drop-shadow(0 8px 10px rgba(59, 48, 40, 0.22));
  transition: transform 0.6s var(--ease);
}
.food-card:hover .food-art { transform: rotate(8deg) scale(1.08); }

/* Photos are transparent cut-outs of the plate, framed on the category colour like the illustrations were */
.food-photo {
  position: absolute;
  inset: 7% 10%;
  width: 80%;
  height: 86%;
  object-fit: contain;
  filter: drop-shadow(0 8px 10px rgba(59, 48, 40, 0.22));
  transition: transform 0.6s var(--ease);
}
.food-card:hover .food-photo { transform: scale(1.06); }

.badge {
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
  padding: 0.2rem 0.75rem;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 999px;
  background: var(--cream);
  color: var(--brown);
}
.price {
  position: absolute;
  right: 0.8rem;
  bottom: 0.8rem;
  padding: 0.3rem 0.9rem;
  font-weight: 700;
  font-size: 0.98rem;
  border-radius: 999px;
  background: var(--terracotta);
  color: var(--white);
  transition: transform 0.3s var(--ease), background 0.3s;
}
.food-card:hover .price {
  transform: scale(1.08);
  background: var(--brown);
}

.food-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.15rem 1.35rem 1.35rem;
}
.food-body h3 { margin-bottom: 0.4rem; }
.food-description {
  flex: 1;
  font-size: 0.9rem;
  opacity: 0.85;
  margin-bottom: 0.85rem;
}
.food-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem 0.75rem;
}
.food-category {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--terracotta-dark);
}
.food-origin {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin: 0;
  padding: 0.1rem 0.65rem 0.1rem 0.5rem;
  font-size: 0.76rem;
  font-weight: 600;
  border-radius: 999px;
  background: var(--gold-soft);
  color: var(--brown);
}
.food-origin svg { width: 0.8rem; height: 0.8rem; color: var(--terracotta); }
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
.open-details {
  display: block;
  padding: 0;
  font: inherit;
  text-align: left;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
}
/* the whole card is the click target */
.open-details::after { content: ''; position: absolute; inset: 0; z-index: 3; border-radius: var(--radius-lg); }
.open-details:focus-visible { outline: none; }
.food-card { position: relative; }
.food-card:focus-within { outline: 3px solid var(--terracotta); outline-offset: 3px; }
.food-card:hover .open-details { color: var(--terracotta); }
.peek {
  position: absolute;
  left: 0.8rem;
  bottom: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.8rem;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 999px;
  background: var(--cream);
  color: var(--brown);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.3s, transform 0.3s var(--ease);
}
.peek svg { width: 0.9rem; height: 0.9rem; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.food-card:hover .peek,
.food-card:focus-within .peek { opacity: 1; transform: none; }
@media (hover: none) { .peek { opacity: 1; transform: none; } }
.food-kcal {
  flex-basis: 100%;
  margin: 0;
  font-size: 0.78rem;
  opacity: 0.75;
}
</style>
