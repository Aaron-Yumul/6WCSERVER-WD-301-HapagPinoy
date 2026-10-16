<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FoodCard from '../components/FoodCard.vue'
import PageHeader from '../components/PageHeader.vue'
import DishDetail from '../components/DishDetail.vue'
import imgSisig from '../assets/picks/pork-sisig.webp'
import imgCanton from '../assets/picks/pancit-canton.webp'
import { categoryNames } from '../data/menuItems'
import { useMenu } from '../stores/menu'

const route = useRoute()
const router = useRouter()
const { items: menuItems, categories, isLoading, hasError, menu, retry } = useMenu()

function categoryFromRoute() {
  const queryCategory = route.query.category
  return categoryNames.includes(queryCategory) ? queryCategory : 'All'
}

const searchText = ref('')
const selectedCategory = ref(categoryFromRoute())

const categoryOptions = computed(() => [
  { name: 'All' },
  ...categories.value.map((category) => ({
    name: category.name,
    count: menuItems.value.filter((item) => item.category === category.name).length,
  })),
])

watch(() => route.query.category, () => {
  selectedCategory.value = categoryFromRoute()
})

function chooseCategory(name) {
  selectedCategory.value = name
  router.replace({ query: name === 'All' ? {} : { category: name } })
}

const localNameByCategory = computed(() => Object.fromEntries(categories.value.map((category) => [category.name, category.local || ''])))

const filteredItems = computed(() => {
  const search = searchText.value.trim().toLowerCase()
  return menuItems.value.filter((item) => {
    const matchesCategory = selectedCategory.value === 'All' || item.category === selectedCategory.value
    const searchable = [item.name, item.category, localNameByCategory.value[item.category], item.origin]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return matchesCategory && (!search || searchable.includes(search))
  })
})

const listEntries = computed(() => {
  const entries = []
  let position = 0
  categories.value.forEach((category) => {
    const itemsInCategory = filteredItems.value.filter((item) => item.category === category.name)
    if (!itemsInCategory.length) return
    entries.push({ type: 'heading', key: `heading-${category.name}`, category, count: itemsInCategory.length, position })
    position += 1
    itemsInCategory.forEach((item) => {
      entries.push({ type: 'item', key: `item-${item.id}`, item, position })
      position += 1
    })
  })
  return entries
})

// Dish details dialog: opens on click and can step through the dishes currently shown
const openId = ref(null)
const openIndex = computed(() => listEntries.value.filter((e) => e.type === 'item').findIndex((e) => e.item.id === openId.value))
const shownItems = computed(() => listEntries.value.filter((e) => e.type === 'item').map((e) => e.item))
const openItem = computed(() => (openIndex.value === -1 ? null : shownItems.value[openIndex.value]))
function openDish(item) { openId.value = item.id }
function closeDish() { openId.value = null }
function stepDish(delta) {
  const next = shownItems.value[openIndex.value + delta]
  if (next) openId.value = next.id
}

function clearFilters() {
  searchText.value = ''
  chooseCategory('All')
}
</script>

<template>
  <div class="page">
    <PageHeader
      eyebrow="Ang Aming Menu"
      title="Tara, kain na!"
      accent="kain na"
      text="Come hungry. Browse by category or search for a dish. All prices are in Philippine pesos (₱)."
      art="rice"
      :image="imgSisig"
      :image2="imgCanton"
    />

    <section class="filters">
      <div class="container filters-inner">
        <div class="field search-field">
          <label for="menu-search">Search the menu</label>
          <div class="search-box">
            <input
              id="menu-search"
              v-model="searchText"
              type="search"
              placeholder="Try adobo, kape or Pampanga"
              autocomplete="off"
            />
            <button
              v-if="searchText"
              type="button"
              class="clear-search"
              aria-label="Clear search"
              @click="searchText = ''"
            >
              &times;
            </button>
          </div>
        </div>

        <div class="category-rail" role="group" aria-label="Filter by category">
          <button
            v-for="option in categoryOptions"
            :key="option.name"
            type="button"
            class="chip"
            :class="{ active: option.name !== 'All' && selectedCategory === option.name }"
            :aria-pressed="selectedCategory === option.name"
            @click="chooseCategory(option.name)"
          >
            {{ option.name }}
            <span v-if="option.count !== undefined" class="chip-count">{{ option.count }}</span>
          </button>
        </div>
      </div>
    </section>

    <section class="section menu-section">
      <div class="container">
        <p v-if="!isLoading && !hasError" class="result-count" aria-live="polite">
          Showing {{ filteredItems.length }} of {{ menuItems.length }} dishes
        </p>

        <div v-if="hasError" class="card empty-state" role="alert">
          <h2>Naku, the menu did not load</h2>
          <p>{{ menu.error }}</p>
          <button type="button" class="btn" @click="retry">Try again</button>
        </div>

        <div v-else-if="isLoading" class="card empty-state" role="status">
          <h2>Kinukuha ang menu...</h2>
          <p>Getting today's dishes ready.</p>
        </div>

        <TransitionGroup v-else-if="filteredItems.length" name="dish" tag="div" class="menu-grid">
          <div
            v-for="entry in listEntries"
            :key="entry.key"
            :class="entry.type === 'heading' ? 'category-heading' : 'dish-slot'"
            :style="{ '--i': Math.min(entry.position, 10) }"
          >
            <template v-if="entry.type === 'heading'">
              <p v-if="entry.category.local" class="kicker">{{ entry.category.local }}</p>
              <h2>{{ entry.category.name }}</h2>
              <p>{{ entry.category.blurb }}</p>
            </template>
            <FoodCard v-else :item="entry.item" @open="openDish" />
          </div>
        </TransitionGroup>

        <div v-else class="card empty-state">
          <h2>Naku, no dishes found</h2>
          <p>
            Nothing matches "{{ searchText }}"<template v-if="selectedCategory !== 'All'"> in {{ selectedCategory }}</template>.
            Check the spelling, try a shorter name, or clear the filters to see the whole menu.
          </p>
          <button type="button" class="btn" @click="clearFilters">Clear search and filters</button>
        </div>
      </div>
    </section>

    <DishDetail
      :item="openItem"
      :has-prev="openIndex > 0"
      :has-next="openIndex !== -1 && openIndex < shownItems.length - 1"
      @close="closeDish"
      @prev="stepDish(-1)"
      @next="stepDish(1)"
    />

    <section class="menu-cta">
      <div class="banig-strip" aria-hidden="true"></div>
      <div class="container menu-cta-inner">
        <div>
          <p class="kicker kicker--light">Gutom na?</p>
          <h2>Save a table for the whole barkada.</h2>
          <p>Eating with family or friends? Choose a date and time on our reservations page.</p>
        </div>
        <RouterLink to="/reservations" class="btn btn--light">Book a table</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.filters {
  position: sticky;
  top: 58px;
  z-index: 50;
  background: var(--cream);
  border-bottom: var(--border);
  box-shadow: 0 6px 14px -10px rgba(59, 48, 40, 0.25);
}
.filters-inner {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  padding-block: 0.9rem;
}
.search-field { flex: 0 0 300px; }
.search-box { position: relative; }
.search-box input { padding-right: 2.6rem; }
.clear-search {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  transform: translateY(-50%);
  font-size: 1.4rem;
  line-height: 1;
  color: var(--brown);
  background: transparent;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
}
.clear-search:hover { background: var(--beige); }

.category-rail {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.chip {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 500;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1.5px solid var(--terracotta);
  background: var(--white);
  color: var(--brown);
  cursor: pointer;
  transition: background 0.25s, color 0.25s, transform 0.15s;
}
.chip:hover { background: var(--beige); }
.chip:active { transform: scale(0.96); }
.chip.active {
  background: var(--terracotta);
  color: var(--white);
}
.chip-count {
  min-width: 1.5rem;
  padding: 0 0.4rem;
  font-size: 0.78rem;
  text-align: center;
  border-radius: 999px;
  background: rgba(59, 48, 40, 0.1);
}
.chip.active .chip-count { background: rgba(255, 255, 255, 0.25); }

.menu-section { padding-top: 2.5rem; }
.result-count { font-size: 0.9rem; opacity: 0.8; margin-bottom: 1.5rem; }

.menu-grid {
  display: grid;
  gap: 1.75rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
.category-heading {
  grid-column: 1 / -1;
  padding-top: 1.5rem;
  padding-bottom: 0.25rem;
}
.category-heading:first-child { padding-top: 0; }
.category-heading h2 { margin-bottom: 0.15rem; }
.category-heading p:not(.kicker) { margin: 0; opacity: 0.8; }
.category-heading::after {
  content: '';
  display: block;
  width: 110px;
  height: 8px;
  margin-top: 0.9rem;
  background: var(--banig-url) repeat-x left center / auto 8px;
}

.dish-enter-active,
.dish-leave-active {
  transition: opacity 0.35s ease, transform 0.35s var(--ease);
}
.dish-enter-active { transition-delay: calc(var(--i, 0) * 35ms); }
.dish-enter-from,
.dish-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  max-width: 560px;
  margin: 0 auto;
  animation: pop 0.4s var(--ease);
}

.menu-cta {
  margin-top: 1rem;
  background: var(--brown);
  color: var(--cream);
}
.menu-cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding-block: 3.25rem;
}
.menu-cta h2 { color: var(--white); margin-bottom: 0.4rem; }
.menu-cta p:not(.kicker) { margin: 0; max-width: 34rem; opacity: 0.9; }
.menu-cta .btn--light::before { background: var(--gold); }
.menu-cta .btn--light:hover { color: var(--brown); border-color: var(--gold); }

@media (max-width: 640px) {
  .menu-cta-inner { flex-direction: column; align-items: flex-start; }
}

@media (max-width: 860px) {
  .filters { top: 58px; }
  .filters-inner { flex-direction: column; align-items: stretch; gap: 0.75rem; }
  .search-field { flex: none; max-width: 420px; }
  .category-rail {
    flex: none;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.4rem;
    scrollbar-width: thin;
  }
}
</style>
