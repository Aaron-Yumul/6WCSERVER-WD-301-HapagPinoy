<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import DishArt from './DishArt.vue'
import { categories, formatPeso, getArtForItem, getTileForCategory } from '../data/menuItems'
import { allergenList, getNutrition, spiceLabels } from '../data/dishDetails'
import { dishPhotos } from '../data/dishPhotos'

const props = defineProps({
  item: { type: Object, default: null }, // dish to show; null = closed
  hasPrev: { type: Boolean, default: false },
  hasNext: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'prev', 'next'])

const dialog = ref(null)
const body = ref(null)

const info = computed(() => (props.item ? getNutrition(props.item.details) : null))
const photo = computed(() => (props.item ? dishPhotos[props.item.slug] : ''))
const tileClass = computed(() => (props.item ? `tile-${getTileForCategory(props.item.category)}` : ''))
const local = computed(() => categories.find((c) => c.name === props.item?.category)?.local || '')
const isDrink = computed(() => info.value?.amount[1] === 'ml')

const servesText = computed(() => {
  const [min, max] = info.value.serves
  if (min === max) return min === 1 ? '1 person' : `${min} people`
  return `${min}–${max} people`
})
const amountText = computed(() => `${info.value.amount[0].toLocaleString('en-PH')} ${info.value.amount[1]}`)
const kcalText = computed(() => (info.value.kcal < 5 ? '< 5' : info.value.kcal.toLocaleString('en-PH')))
const eachText = computed(() => {
  const [low, high] = info.value.kcalEach
  return low === high ? `${low}` : `${low}–${high}`
})
const shared = computed(() => info.value.serves[1] > 1)

// Share of the dish's calories that come from each macro (4 / 4 / 9 kcal per gram)
const macros = computed(() => {
  const { protein, carbs, fat } = info.value
  const parts = [
    { key: 'protein', label: 'Protein', grams: protein, kcal: protein * 4 },
    { key: 'carbs', label: 'Carbs', grams: carbs, kcal: carbs * 4 },
    { key: 'fat', label: 'Fat', grams: fat, kcal: fat * 9 },
  ]
  const total = parts.reduce((sum, p) => sum + p.kcal, 0)
  return parts.map((p) => ({ ...p, percent: total ? Math.round((p.kcal / total) * 100) : 0 }))
})
const hasMacros = computed(() => macros.value.some((m) => m.grams > 0))

const allergenState = computed(() =>
  allergenList.map((name) => ({ name, present: info.value.allergens.includes(name) })),
)

watch(
  () => props.item,
  async (item) => {
    await nextTick()
    const el = dialog.value
    if (!el) return
    if (item && !el.open) {
      el.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!item && el.open) {
      el.close()
    }
    if (item && body.value) body.value.scrollTop = 0
  },
)

function onClosed() {
  document.documentElement.style.overflow = ''
  if (props.item) emit('close')
}
// Click on the dark backdrop (the <dialog> itself, outside the panel) closes it
function onBackdrop(event) {
  if (event.target === dialog.value) emit('close')
}
function onKey(event) {
  if (event.key === 'ArrowRight' && props.hasNext) emit('next')
  if (event.key === 'ArrowLeft' && props.hasPrev) emit('prev')
}
</script>

<template>
  <dialog
    ref="dialog"
    class="detail"
    aria-labelledby="dish-detail-title"
    @close="onClosed"
    @click="onBackdrop"
    @keydown="onKey"
  >
    <article v-if="item && info" class="panel">
      <button type="button" class="close" aria-label="Close dish details" @click="emit('close')">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      <div class="panel-scroll" ref="body">
        <header class="hero" :class="tileClass">
          <div class="hero-art" aria-hidden="true">
            <span class="hero-ring"></span>
            <img v-if="photo" :src="photo" class="hero-photo" width="720" height="720" alt="" draggable="false" />
            <DishArt v-else class="hero-illustration" :kind="getArtForItem(item)" :tone="item.tone" />
          </div>
          <div class="hero-text">
            <p v-if="local" class="kicker">{{ local }}</p>
            <h2 id="dish-detail-title">{{ item.name }}</h2>
            <p class="chips">
              <span v-if="item.badge" class="chip chip--badge">{{ item.badge }}</span>
              <span class="chip">{{ item.category }}</span>
              <span v-if="item.origin" class="chip chip--origin">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg>
                {{ item.origin }}
              </span>
            </p>
            <p class="desc">{{ item.description }}</p>
            <p class="price">{{ formatPeso(item.price) }}</p>
          </div>
        </header>

        <div class="content">
          <!-- Quick facts -->
          <ul class="facts" aria-label="Quick facts">
            <li>
              <span class="fact-label">Serves</span>
              <strong>{{ servesText }}</strong>
              <span class="fact-sub">{{ info.portion }}</span>
            </li>
            <li>
              <span class="fact-label">{{ isDrink ? 'Volume' : 'Weight' }}</span>
              <strong>{{ amountText }}</strong>
              <span class="fact-sub">per order</span>
            </li>
            <li class="fact-kcal">
              <span class="fact-label">Calories</span>
              <strong>{{ kcalText }} <small>kcal</small></strong>
              <span class="fact-sub">{{ info.dailyPercent < 1 ? 'almost none' : `about ${info.dailyPercent}% of 2,000 a day` }}</span>
            </li>
            <li>
              <span class="fact-label">Ready in</span>
              <strong>~{{ info.prep }} min</strong>
              <span class="fact-sub">after ordering</span>
            </li>
          </ul>

          <p v-if="shared" class="each">
            Shared by {{ info.serves[0] === info.serves[1] ? info.serves[0] : `${info.serves[0]} to ${info.serves[1]}` }}:
            about <strong>{{ eachText }} kcal</strong> each.
          </p>

          <div class="grid">
            <!-- Nutrition -->
            <section class="block" aria-labelledby="nutrition-title">
              <h3 id="nutrition-title">Nutrition per order</h3>
              <template v-if="hasMacros">
                <div class="bar" role="img" :aria-label="macros.map((m) => `${m.label} ${m.percent}% of calories`).join(', ')">
                  <span v-for="m in macros" :key="m.key" :class="`seg seg--${m.key}`" :style="{ flexGrow: Math.max(m.kcal, 1) }"></span>
                </div>
                <ul class="macros">
                  <li v-for="m in macros" :key="m.key">
                    <span class="dot" :class="`dot--${m.key}`"></span>
                    <span class="macro-name">{{ m.label }}</span>
                    <strong>{{ m.grams }} g</strong>
                    <span class="macro-pct">{{ m.percent }}% of kcal</span>
                  </li>
                </ul>
              </template>
              <p v-else class="plain">Plain coffee has almost no protein, carbs or fat.</p>
              <p v-if="info.caffeine" class="caffeine">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 2v3M10 2v3M14 2v3" /></svg>
                About <strong>{{ info.caffeine }} mg</strong> caffeine
              </p>
            </section>

            <!-- Spice + allergens -->
            <section class="block" aria-labelledby="care-title">
              <h3 id="care-title">Good to know</h3>
              <div class="spice">
                <span class="spice-name">Spice level</span>
                <span class="peppers" :aria-label="spiceLabels[info.spice]">
                  <svg
                    v-for="n in 3"
                    :key="n"
                    viewBox="0 0 24 24"
                    :class="{ on: n <= info.spice }"
                    aria-hidden="true"
                  ><path d="M15.500 2.500c-1.800.2-3 1.200-3.400 3C7.500 6.500 3.500 11 3 18.500c0 1 .5 1.500 1.500 1.300C13.500 18.500 20 14 20 9c0-2-1-3.500-2.700-3.800.1-1.500-.4-2.700-1.800-2.700z" /></svg>
                  <span class="peppers-text">{{ spiceLabels[info.spice] }}</span>
                </span>
              </div>
              <div class="allergens">
                <span class="spice-name">Contains</span>
                <ul v-if="info.allergens.length" class="tags">
                  <li v-for="a in allergenState.filter((x) => x.present)" :key="a.name">{{ a.name }}</li>
                </ul>
                <p v-else class="plain">None of the 8 common allergens in the recipe.</p>
              </div>
              <p class="main-tag">
                <span class="spice-name">Main ingredient</span>
                <strong>{{ info.main }}</strong>
              </p>
            </section>
          </div>

          <section class="block" aria-labelledby="ingredients-title">
            <h3 id="ingredients-title">What's in it</h3>
            <ul class="tags tags--ingredients">
              <li v-for="ingredient in info.ingredients" :key="ingredient">{{ ingredient }}</li>
            </ul>
          </section>

          <p class="tip"><strong>Tip:</strong> {{ info.tip }}</p>

          <p class="fineprint">
            Nutrition values are estimates for a typical recipe and can change with the cook, the ingredients and the portion.
            If you have an allergy, please tell our staff before you order.
          </p>
        </div>
      </div>

      <footer class="nav">
        <button type="button" class="step" :disabled="!hasPrev" @click="emit('prev')">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
          <span>Previous</span>
        </button>
        <button type="button" class="step" :disabled="!hasNext" @click="emit('next')">
          <span>Next dish</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </footer>
    </article>
  </dialog>
</template>

<style scoped>
.detail {
  width: min(920px, calc(100vw - 2rem));
  max-width: none;
  max-height: min(92dvh, 860px);
  padding: 0;
  border: 0;
  border-radius: var(--radius-lg);
  background: var(--cream);
  color: var(--brown);
  box-shadow: 0 30px 80px rgba(30, 20, 14, 0.45);
  overflow: hidden;
}
.detail[open] { display: flex; animation: sheet-in 0.4s var(--ease); }
.detail::backdrop {
  background: rgba(40, 28, 20, 0.62);
  backdrop-filter: blur(3px);
  animation: fade-in 0.3s ease;
}
@keyframes sheet-in { from { opacity: 0; transform: translateY(24px) scale(0.98); } to { opacity: 1; transform: none; } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

.panel { position: relative; display: flex; flex-direction: column; width: 100%; min-height: 0; max-height: inherit; }
.panel-scroll { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }

.close {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  z-index: 5;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--white);
  color: var(--brown);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: background-color 0.25s, color 0.25s, transform 0.25s var(--ease);
}
.close:hover { background: var(--terracotta); color: var(--white); transform: rotate(90deg); }
.close svg, .step svg, .chip--origin svg, .caffeine svg {
  width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
}

/* ---- Hero ---- */
.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  align-items: center;
  gap: 1.5rem;
  padding: 2.5rem 2.5rem 2rem;
  border: 0;
  border-bottom: 1px solid var(--beige);
  border-radius: 0;
}
.hero.tile-cocoa { color: var(--cream); }
.hero.tile-cocoa h2 { color: var(--white); }
.hero.tile-cocoa .kicker { color: var(--gold); }
.hero.tile-cocoa .chip { background: rgba(248, 241, 229, 0.14); color: var(--cream); border-color: rgba(248, 241, 229, 0.3); }
.hero.tile-cocoa .price { background: var(--gold); color: var(--brown); }
.hero-art { position: relative; width: 100%; max-width: 300px; aspect-ratio: 1; margin-inline: auto; }
.hero-ring {
  position: absolute;
  inset: -4%;
  border: 1.5px dashed rgba(122, 41, 37, 0.45);
  border-radius: 50%;
  animation: ring-turn 60s linear infinite;
}
.hero.tile-cocoa .hero-ring { border-color: rgba(217, 164, 65, 0.7); }
.hero-photo, .hero-illustration {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 16px 18px rgba(59, 48, 40, 0.3));
  animation: dish-in 0.8s var(--ease) both, bob 8s ease-in-out 0.8s infinite;
}
.hero-illustration { padding: 6%; }
@keyframes ring-turn { to { transform: rotate(360deg); } }
@keyframes dish-in { from { opacity: 0; transform: scale(0.8) rotate(-18deg); } to { opacity: 1; transform: none; } }
@keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }

.hero-text { min-width: 0; padding-right: 2.5rem; }
.hero-text .kicker { margin-bottom: 0.4rem; }
.hero-text h2 { margin: 0 0 0.7rem; font-size: clamp(1.7rem, 3.4vw, 2.4rem); overflow-wrap: anywhere; }
.chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0 0 0.9rem; }
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.15rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid rgba(59, 48, 40, 0.15);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
}
.chip--badge { background: color-mix(in srgb, var(--terracotta) 16%, var(--white)); color: var(--terracotta-dark); border-color: transparent; }
.chip--origin { background: var(--gold-soft); border-color: transparent; }
.chip--origin svg { width: 0.85rem; height: 0.85rem; fill: currentColor; stroke: none; color: var(--terracotta); }
.desc { margin: 0 0 1rem; font-size: 1rem; }
.price {
  display: inline-block;
  margin: 0;
  padding: 0.25rem 1.1rem;
  font-size: 1.15rem;
  font-weight: 700;
  border-radius: 999px;
  background: var(--terracotta);
  color: var(--white);
}

/* ---- Content ---- */
.content { padding: 1.75rem 2.5rem 2rem; }
.facts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.facts li {
  display: flex;
  flex-direction: column;
  padding: 0.9rem 1rem;
  border-radius: var(--radius);
  background: var(--white);
  border: var(--border);
  box-shadow: var(--shadow-sm);
}
.facts .fact-kcal { background: var(--terracotta); border-color: var(--terracotta); color: var(--cream); }
.fact-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.7; }
.facts strong { font-family: var(--font-display); font-size: 1.35rem; line-height: 1.2; margin: 0.15rem 0; }
.facts strong small { font-family: var(--font-body); font-size: 0.8rem; font-weight: 500; }
.fact-sub { font-size: 0.78rem; line-height: 1.35; opacity: 0.8; }
.each { margin: 0.9rem 0 0; font-size: 0.92rem; }

.grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 1rem; margin-top: 1.25rem; }
.block {
  padding: 1.1rem 1.25rem;
  border-radius: var(--radius);
  background: var(--white);
  border: var(--border);
}
.grid + .block { margin-top: 1rem; }
.block h3 { margin: 0 0 0.8rem; font-size: 1.05rem; }

.bar { display: flex; gap: 3px; height: 14px; margin-bottom: 0.9rem; }
.seg { min-width: 6px; border-radius: 999px; }
.seg--protein, .dot--protein { background: var(--terracotta); }
.seg--carbs, .dot--carbs { background: var(--gold); }
.seg--fat, .dot--fat { background: var(--brown); }
.macros { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.45rem; }
.macros li { display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: 0.55rem; font-size: 0.92rem; }
.dot { width: 0.7rem; height: 0.7rem; border-radius: 50%; }
.macro-pct { min-width: 5.2rem; text-align: right; font-size: 0.78rem; opacity: 0.7; }
.caffeine { display: flex; align-items: center; gap: 0.5rem; margin: 0.9rem 0 0; font-size: 0.9rem; }
.caffeine svg { width: 18px; height: 18px; color: var(--terracotta); }
.plain { margin: 0; font-size: 0.9rem; opacity: 0.8; }

.spice, .allergens, .main-tag { display: flex; flex-direction: column; gap: 0.35rem; margin: 0 0 1rem; }
.main-tag { margin-bottom: 0; }
.spice-name { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.7; }
.peppers { display: inline-flex; align-items: center; gap: 0.25rem; }
.peppers svg { width: 22px; height: 22px; fill: #e1d6c3; stroke: none; }
.peppers svg.on { fill: #b3261e; }
.peppers-text { margin-left: 0.4rem; font-size: 0.9rem; font-weight: 600; }

.tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0; padding: 0; list-style: none; }
.tags li {
  padding: 0.18rem 0.7rem;
  font-size: 0.82rem;
  font-weight: 500;
  border-radius: 999px;
  background: color-mix(in srgb, var(--terracotta) 12%, var(--white));
  color: var(--terracotta-dark);
}
.tags--ingredients li { background: var(--beige); color: var(--brown); }

.tip {
  position: relative;
  margin: 1rem 0 0;
  padding: 1rem 1.25rem 1rem 1.5rem;
  border-radius: var(--radius);
  background: var(--gold-soft);
  border-left: 5px solid var(--gold);
}
.fineprint { margin: 1rem 0 0; font-size: 0.78rem; line-height: 1.5; opacity: 0.7; }

/* ---- Footer navigation ---- */
.nav {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: var(--white);
  border-top: 1px solid var(--beige);
}
.step {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.1rem;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--brown);
  background: transparent;
  border: 1.5px solid var(--brown);
  border-radius: var(--radius);
  cursor: pointer;
  transition: background-color 0.25s, color 0.25s, border-color 0.25s;
}
.step:hover:not(:disabled) { background: var(--terracotta); border-color: var(--terracotta); color: var(--white); }
.step:disabled { opacity: 0.35; cursor: not-allowed; }

/* ---- Responsive ---- */
@media (max-width: 760px) {
  .detail {
    width: 100vw;
    max-height: 94dvh;
    margin: auto 0 0;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
  .hero { grid-template-columns: 1fr; padding: 1.75rem 1.25rem 1.5rem; gap: 1rem; text-align: left; }
  .hero-art { max-width: 210px; }
  .hero-text { padding-right: 0; }
  .content { padding: 1.25rem 1.25rem 1.5rem; }
  .facts { grid-template-columns: repeat(2, 1fr); }
  .grid { grid-template-columns: 1fr; }
  .macros li { grid-template-columns: auto 1fr auto; }
  .macro-pct { display: none; }
  .nav { padding: 0.6rem 1rem calc(0.6rem + env(safe-area-inset-bottom)); }
  .step { flex: 1; justify-content: center; }
  @keyframes sheet-in { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: none; } }
}

@media (prefers-reduced-motion: reduce) {
  .detail[open], .detail::backdrop, .hero-ring, .hero-photo, .hero-illustration { animation: none; }
}
</style>
