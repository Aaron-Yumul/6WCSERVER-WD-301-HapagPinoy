<script setup>
import { computed } from 'vue'
import DishArt from '../components/DishArt.vue'
import HeroScene from '../components/HeroScene.vue'
import { formatPeso, getArtForItem, getTileForCategory } from '../data/menuItems'
import { useMenu } from '../stores/menu'
import tileAppetizers from '../assets/tiles/appetizers.webp'
import tilePasta from '../assets/tiles/pasta.webp'
import tileRicemeals from '../assets/tiles/ricemeals.webp'
import tileMaincourse from '../assets/tiles/maincourse.webp'
import tileBread from '../assets/tiles/bread.webp'
import tileDesserts from '../assets/tiles/desserts.webp'
import tileHotcoffee from '../assets/tiles/hotcoffee.webp'
import tileIcedcoffee from '../assets/tiles/icedcoffee.webp'
import tileBeverages from '../assets/tiles/beverages.webp'
import adoboImg from '../assets/hero/adobo.webp'
import flanImg from '../assets/hero/lecheflan.webp'
import tsokolateImg from '../assets/hero/tsokolate.webp'
import pickCanton from '../assets/picks/pancit-canton.webp'
import pickSisig from '../assets/picks/pork-sisig.webp'
import pickBulalo from '../assets/picks/bulalo.webp'
import pickUbe from '../assets/picks/ube-pandesal.webp'
import pickHalo from '../assets/picks/halo-halo.webp'
import pickLatte from '../assets/picks/spanish-latte.webp'

const { items: menuItems, categories } = useMenu()
const featuredItems = computed(() => menuItems.value.filter((item) => item.featured))

// Real photos (backgrounds removed, 720x720 transparent WebP) for the Chef's picks, keyed by
// menu item slug. A pick without a photo falls back to its DishArt illustration.
const pickPhotos = {
  'pancit-canton': pickCanton,
  'pork-sisig-rice-meal': pickSisig,
  bulalo: pickBulalo,
  'ube-cheese-pandesal': pickUbe,
  'halo-halo': pickHalo,
  'spanish-latte': pickLatte,
}

// Filipino name of each category (shown as a small label, like on the other pages)
const localByCategory = computed(() => Object.fromEntries(categories.value.map((category) => [category.name, category.local])))

// Real top-down photos (backgrounds removed) for every category tile.
const photos = {
  'Appetizers': { src: tileAppetizers, w: 640, h: 640 },
  'Pasta and Noodles': { src: tilePasta, w: 503, h: 503 },
  'Rice Meals': { src: tileRicemeals, w: 525, h: 455 },
  'Main Courses': { src: tileMaincourse, w: 464, h: 464 },
  'Breads': { src: tileBread, w: 425, h: 425 },
  'Desserts': { src: tileDesserts, w: 640, h: 605 },
  'Hot Coffee': { src: tileHotcoffee, w: 597, h: 563 },
  'Iced Coffee': { src: tileIcedcoffee, w: 519, h: 519 },
  'Beverages': { src: tileBeverages, w: 446, h: 484 },
}
const areas = {
  Appetizers: 'app',
  'Pasta and Noodles': 'pasta',
  'Rice Meals': 'rice',
  'Main Courses': 'main',
  Breads: 'bread',
  Desserts: 'dess',
  'Hot Coffee': 'hot',
  'Iced Coffee': 'iced',
  Beverages: 'bev',
}

const categoryTiles = computed(() =>
  categories.value.map((category) => ({
    ...category,
    area: areas[category.name],
    photo: photos[category.name],
    count: menuItems.value.filter((item) => item.category === category.name).length,
  })),
)

const bokeh = [
  { x: '6%', y: '18%', s: '90px', dur: '9s', delay: '0s' },
  { x: '28%', y: '70%', s: '140px', dur: '12s', delay: '1.5s' },
  { x: '58%', y: '12%', s: '150px', dur: '13s', delay: '2.2s' },
  { x: '80%', y: '76%', s: '96px', dur: '10s', delay: '4s' },
  { x: '92%', y: '30%', s: '120px', dur: '12s', delay: '1s' },
]

const experience = [
  { icon: 'flame', title: 'Cooked to order', text: 'Rice meals, grilled favorites and sizzling plates are prepared when you order, so they reach the table hot.' },
  { icon: 'users', title: 'Made for sharing', text: 'Pancit, appetizers and stews are made to share, with room for dessert at the end.' },
  { icon: 'coffee', title: 'Coffee all day', text: 'Kapeng barako and espresso drinks, hot or iced, are served for as long as the kitchen is open.' },
]

const steps = [
  { icon: 'calendar', title: 'Pick a date and time', text: 'Time slots follow our opening hours, so you only see times that are open.' },
  { icon: 'user', title: 'Add your details', text: 'Tell us your name, contact info, party size and any special requests.' },
  { icon: 'check', title: 'Get your reference code', text: 'Your table is confirmed right away. Use the code to view, change or cancel it, and pre-order your meal if you like.' },
]

</script>

<template>
  <div class="page">
    <section class="hero">
      <div class="hero-bg" aria-hidden="true">
        <div class="hero-photo"></div>
        <div class="hero-wash"></div>
        <span
          v-for="(b, i) in bokeh"
          :key="i"
          class="bokeh"
          :style="{ '--x': b.x, '--y': b.y, '--s': b.s, '--dur': b.dur, '--delay': b.delay }"
        ></span>
        <div class="hero-fade-top"></div>
        <div class="hero-fade-bottom"></div>
      </div>
      <div class="garlands garlands--light" aria-hidden="true"><i class="garland"></i></div>

      <div class="container hero-grid">
        <div class="hero-text">
          <p class="kicker rise" style="--d: 0ms">Maligayang Pagdating</p>
          <h1>
            <span class="line rise" style="--d: 120ms">Sarap at Saya</span>
            <span class="line rise" style="--d: 260ms">
              <span class="accent-word">
                sa Bawat Hapag.
                <svg class="squiggle" viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                  <path d="M2 8 C 25 1, 45 14, 70 7 S 115 1, 140 8 S 190 14, 215 7 S 270 2, 298 8" pathLength="1" />
                </svg>
              </span>
            </span>
          </h1>
          <p class="lead rise" style="--d: 420ms">
            Filipino favorites like adobo, sinigang and pancit, warm pandesal and barako coffee made to
            order. Look through the menu, then save a table for the people you want to share it with.
          </p>
          <div class="btn-row rise" style="--d: 540ms">
            <RouterLink to="/menu" class="btn">Explore Our Menu</RouterLink>
            <RouterLink to="/reservations" class="btn btn--outline">Book a Table</RouterLink>
          </div>
        </div>
        <HeroScene />
      </div>
    </section>

    <!-- Categories -->
    <section id="categories" class="section">
      <div class="container">
        <div class="section-heading" v-reveal>
          <p class="kicker">Anong Gusto Mo?</p>
          <h2>Start with what you're craving</h2>
          <p>Pick a category to jump straight to those dishes.</p>
        </div>
        <ul class="bento">
          <li
            v-for="(category, index) in categoryTiles"
            :key="category.name"
            :style="{ gridArea: category.area }"
            v-reveal="{ delay: (index % 4) * 70 }"
          >
            <RouterLink
              :to="{ path: '/menu', query: { category: category.name } }"
              class="tile"
              :class="[`tile-${category.tile}`, { 'tile--lead': category.area === 'pasta' }]"
            >
              <span class="tile-text">
                <span class="tile-local">{{ category.local }}</span>
                <span class="tile-name">{{ category.name }}</span>
                <span class="tile-blurb">{{ category.blurb }}</span>
                <span v-if="category.count" class="tile-count">{{ category.count }} dishes</span>
              </span>
              <span class="tile-go" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
              <span class="tile-art" aria-hidden="true">
                <span class="tile-spin">
                  <img
                    v-if="category.photo"
                    class="tile-photo"
                    :src="category.photo.src"
                    :width="category.photo.w"
                    :height="category.photo.h"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                  <DishArt v-else :kind="category.art" :tone="category.artTone" />
                </span>
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- Chef's picks -->
    <section v-if="featuredItems.length" class="section section--beige picks-section">
      <div class="container">
        <div class="section-heading section-heading--row" v-reveal>
          <div>
            <p class="kicker">Mga Piniling Putahe</p>
            <h2>Chef's picks</h2>
            <p>{{ featuredItems.length }} dishes to try if it's your first visit.</p>
          </div>
          <RouterLink to="/menu" class="btn btn--outline">See the full menu</RouterLink>
        </div>

        <div class="picks">
          <article
            v-for="(item, index) in featuredItems"
            :key="item.id"
            class="pick"
            :class="{ 'pick--lead': index === 0 }"
            v-reveal="{ delay: index * 70 }"
          >
            <div class="pick-art" :class="index === 0 ? '' : `tile-${getTileForCategory(item.category)}`" aria-hidden="true">
              <span class="pick-dish">
                <span class="pick-float" :style="{ '--dur': `${6.5 + (index % 3) * 0.9}s`, '--delay': `${-index * 1.3}s` }">
                  <img
                    v-if="pickPhotos[item.slug]"
                    class="pick-photo"
                    :src="pickPhotos[item.slug]"
                    width="720"
                    height="720"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                  <DishArt v-else :kind="getArtForItem(item)" :tone="item.tone" />
                </span>
              </span>
            </div>
            <div class="pick-body">
              <span v-if="item.badge" class="pick-badge">{{ item.badge }}</span>
              <h3>
                <RouterLink :to="{ path: '/menu', query: { category: item.category } }" class="pick-link">{{ item.name }}</RouterLink>
              </h3>
              <p class="pick-desc">{{ item.description }}</p>
              <p class="pick-foot">
                <span class="pick-cat">{{ localByCategory[item.category] || item.category }}<span class="visually-hidden"> ({{ item.category }})</span></span>
                <span class="pick-price">{{ formatPeso(item.price) }}</span>
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Experience -->
    <section class="section">
      <div class="container experience">
        <div class="spread" aria-hidden="true" v-reveal>
          <img class="spread-img spread-flan" :src="flanImg" width="441" height="436" alt="" loading="lazy" decoding="async" />
          <img class="spread-img spread-adobo" :src="adoboImg" width="722" height="722" alt="" loading="lazy" decoding="async" />
          <img class="spread-img spread-tsokolate" :src="tsokolateImg" width="446" height="484" alt="" loading="lazy" decoding="async" />
        </div>

        <div class="experience-copy">
          <div class="experience-intro" v-reveal>
            <p class="kicker">Halina't Kumain</p>
            <h2>Come hungry. Stay for the company.</h2>
            <p>
              HapagPinoy takes its name from the Filipino dining table: long tables, easy
              conversation and food that is ready when you are.
            </p>
          </div>
          <ul class="perks">
            <li v-for="(item, index) in experience" :key="item.title" class="perk" v-reveal="{ delay: index * 90 }">
              <span class="perk-icon" aria-hidden="true">
                <svg v-if="item.icon === 'flame'" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
                <svg v-else-if="item.icon === 'users'" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <svg v-else viewBox="0 0 24 24"><path d="M10 2v2" /><path d="M14 2v2" /><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" /><path d="M6 2v2" /></svg>
              </span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.text }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Reservation steps -->
    <section class="section section--beige">
      <div class="container">
        <div class="section-heading" v-reveal>
          <p class="kicker">Tatlong Hakbang</p>
          <h2>Reserving a table takes three steps</h2>
          <p>Your booking is saved right away, and you can cancel it yourself anytime.</p>
        </div>
        <ol class="tickets">
          <li v-for="(step, index) in steps" :key="step.title" class="ticket" v-reveal="{ delay: index * 110 }">
            <div class="ticket-top">
              <span class="ticket-num" aria-hidden="true">{{ index + 1 }}</span>
              <span class="ticket-icon" aria-hidden="true">
                <svg v-if="step.icon === 'calendar'" viewBox="0 0 24 24"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
                <svg v-else-if="step.icon === 'user'" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <svg v-else viewBox="0 0 24 24"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>
              </span>
            </div>
            <div class="ticket-body">
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="cta-section">
      <div class="garlands garlands--dark" aria-hidden="true"><i class="garland"></i></div>
      <div class="container cta">
        <div class="cta-copy" v-reveal>
          <p class="eyebrow">Magpareserba Na</p>
          <h2>Save a table for your next meal</h2>
          <p>Choose a day, a time and how many of you are coming.</p>
          <div class="btn-row">
            <RouterLink to="/reservations" class="btn btn--light">Reserve a table</RouterLink>
          </div>
        </div>

        <div class="cta-art" aria-hidden="true" v-reveal="{ delay: 120 }">
          <div class="cta-disc"></div>
          <div class="cta-ring"></div>
          <div class="cta-plate plate-a"><div class="cta-float" style="--dur: 7.5s"><img :src="tileMaincourse" width="464" height="464" alt="" loading="lazy" decoding="async" /></div></div>
          <div class="cta-plate plate-b"><div class="cta-float" style="--dur: 6.5s"><img :src="tileDesserts" width="640" height="605" alt="" loading="lazy" decoding="async" /></div></div>
          <div class="cta-plate plate-c"><div class="cta-float" style="--dur: 8s"><img :src="tileAppetizers" width="640" height="640" alt="" loading="lazy" decoding="async" /></div></div>

          <div class="cta-seal">
            <svg class="seal-ring" viewBox="0 0 120 120" focusable="false">
              <defs><path id="cta-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
              <text><textPath href="#cta-circle" textLength="272" lengthAdjust="spacing">SARAP AT SAYA · SA BAWAT HAPAG · </textPath></text>
            </svg>
            <svg class="seal-core" viewBox="0 0 120 120" focusable="false">
              <circle cx="60" cy="60" r="27" class="seal-disc" />
              <circle cx="60" cy="60" r="6.5" class="seal-sun" />
              <g class="seal-rays">
                <line x1="60" y1="42" x2="60" y2="50" /><line x1="60" y1="42" x2="60" y2="50" transform="rotate(45 60 60)" />
                <line x1="60" y1="42" x2="60" y2="50" transform="rotate(90 60 60)" /><line x1="60" y1="42" x2="60" y2="50" transform="rotate(135 60 60)" />
                <line x1="60" y1="42" x2="60" y2="50" transform="rotate(180 60 60)" /><line x1="60" y1="42" x2="60" y2="50" transform="rotate(225 60 60)" />
                <line x1="60" y1="42" x2="60" y2="50" transform="rotate(270 60 60)" /><line x1="60" y1="42" x2="60" y2="50" transform="rotate(315 60 60)" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ---------- Hero ---------- */
.hero {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  min-height: calc(100vh - var(--nav-height));
  min-height: calc(100svh - var(--nav-height));
  padding: 3rem 0 5.5rem;
  overflow: hidden;
}

/* Sharp restaurant photo; the wash and edge fades above it are kept light so
   the image stays visible. Only a cheap transform drifts. */
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: var(--cream);
}
.hero-photo {
  position: absolute;
  inset: -6%;
  background: url('../assets/hero-restaurant-new.webp') center / cover no-repeat;
  animation: kenburns 34s ease-in-out infinite alternate;
  will-change: transform;
}
.hero-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url('../assets/hero-restaurant-new-blur.webp') center / cover no-repeat;
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 42%, transparent 78%);
  mask-image: linear-gradient(90deg, #000 0%, #000 42%, transparent 78%);
}
.hero-wash {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 78% 48%, rgba(122, 41, 37, 0.1), transparent 55%),
    linear-gradient(100deg, rgba(248, 241, 229, 0.8) 0%, rgba(248, 241, 229, 0.62) 36%, rgba(248, 241, 229, 0.2) 66%, rgba(248, 241, 229, 0.05) 100%);
}
.hero-fade-top {
  position: absolute;
  inset: 0 0 auto 0;
  height: 56px;
  background: linear-gradient(rgba(248, 241, 229, 0.85), rgba(248, 241, 229, 0));
}
.hero-fade-bottom {
  position: absolute;
  inset: auto 0 0 0;
  height: 80px;
  background: linear-gradient(rgba(248, 241, 229, 0), var(--cream));
}
.bokeh {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--s);
  height: var(--s);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(217, 164, 65, 0.85), rgba(217, 164, 65, 0) 68%);
  opacity: 0.15;
  will-change: transform, opacity;
  animation: bokeh var(--dur) ease-in-out var(--delay) infinite;
}
@keyframes kenburns {
  from { transform: scale(1.02) translate3d(-1.5%, 0, 0); }
  to { transform: scale(1.1) translate3d(1.5%, -1.5%, 0); }
}
@keyframes bokeh {
  0%, 100% { opacity: 0.15; transform: translate3d(0, 0, 0) scale(0.9); }
  50% { opacity: 0.7; transform: translate3d(0, -26px, 0) scale(1.1); }
}

.hero-grid { position: relative; z-index: 1; }

.hero-grid {
  display: grid;
  gap: 3rem;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
}
.hero-text .kicker { margin-bottom: 0; }
.hero-text h1 { margin: 1rem 0 1.25rem; font-size: clamp(2.8rem, 6.5vw, 4.9rem); line-height: 1.02; }
.line { display: block; }
.lead { font-size: 1.1rem; max-width: 30rem; margin-bottom: 1.75rem; }
/* Static gradient text: an animated clipped gradient repaints every frame */
.accent-word {
  position: relative;
  display: inline-block;
  padding-bottom: 0.12em;
  background: linear-gradient(100deg, var(--terracotta-dark) 0%, #A23B31 45%, var(--terracotta) 72%, var(--terracotta-dark) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.squiggle {
  position: absolute;
  left: 0;
  bottom: -0.05em;
  width: 100%;
  height: 0.22em;
  overflow: visible;
}
.squiggle path {
  fill: none;
  stroke: var(--gold);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  vector-effect: non-scaling-stroke;
  animation: draw 1.2s var(--ease) 1s forwards;
}

/* ---------- Shared section heading ---------- */
.section-heading h2::after,
.experience-intro h2::after {
  content: '';
  display: block;
  width: 92px;
  height: 10px;
  margin-top: 0.55rem;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 92 10'%3E%3Cpath d='M2 6 C 10 1, 16 10, 25 5 S 40 1, 48 5 S 64 10, 72 5 S 84 2, 90 5' fill='none' stroke='%23b86b4b' stroke-width='2.6' stroke-linecap='round'/%3E%3C/svg%3E") left center / contain no-repeat;
}
.section-heading { max-width: 640px; margin-bottom: 2.75rem; }
/* The global ".section-heading p" rule would flatten the Filipino label; keep its own spacing */
.section-heading .kicker,
.experience-intro .kicker { margin: 0 0 0.6rem; opacity: 1; }
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
.section-heading--row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  max-width: none;
}
.section-heading--row .btn { flex: none; }

/* ---------- Categories: bento ---------- */
.bento {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.1rem;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(212px, auto);
  grid-template-areas:
    'app pasta pasta rice'
    'main pasta pasta bread'
    'dess hot iced bev';
}
.bento > li { min-width: 0; }

.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 212px;
  padding: 1.35rem 1.4rem;
  overflow: hidden;
  isolation: isolate;
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--brown);
  transition: transform 0.35s var(--ease);
}
.tile::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -2;
  background: radial-gradient(circle at 82% 88%, rgba(255, 255, 255, 0.4), transparent 58%);
}
.tile-cocoa::before { background: radial-gradient(circle at 82% 88%, rgba(122, 41, 37, 0.45), transparent 60%); }
.tile.tile-cocoa { color: var(--cream); }
.tile:hover { transform: translateY(-4px); }

.tile-text {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  max-width: 64%;
}
/* Filipino name of the category, in the same style as the labels on the Menu page */
.tile-local {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 0.45rem;
  margin-bottom: 0.35rem;
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--terracotta);
}
.tile-local::before {
  content: '';
  flex: none;
  width: 0.4rem;
  height: 0.4rem;
  background: var(--gold);
  transform: rotate(45deg);
}
.tile-cocoa .tile-local { color: var(--gold); }
.tile--lead .tile-local { font-size: 0.78rem; margin-bottom: 0.5rem; }
.tile-name {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.15;
}
.tile-blurb { display: none; margin-top: 0.5rem; font-size: 0.95rem; opacity: 0.85; max-width: 18rem; }
.tile-count { margin-top: 0.25rem; font-size: 0.85rem; opacity: 0.75; }

.tile-go {
  position: absolute;
  left: 1.4rem;
  bottom: 1.3rem;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(59, 48, 40, 0.09);
  color: inherit;
  transition: background-color 0.3s, color 0.3s;
}
.tile-cocoa .tile-go { background: rgba(248, 241, 229, 0.16); }
.tile-go svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.tile:hover .tile-go { background: var(--terracotta); color: var(--white); }

.tile-art {
  position: absolute;
  right: -13%;
  bottom: -13%;
  z-index: -1;
  width: 60%;
  aspect-ratio: 1;
  pointer-events: none;
}
.tile-spin {
  display: block;
  width: 100%;
  height: 100%;
  transition: transform 0.6s var(--ease);
}
.tile:hover .tile-spin { transform: rotate(12deg) scale(1.06); }
.tile-photo,
.tile-spin :deep(.dish-art) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 10px 12px rgba(59, 48, 40, 0.24));
}

.tile--lead { padding: 1.9rem; }
.tile--lead .tile-name { font-size: clamp(1.8rem, 3vw, 2.4rem); }
.tile--lead .tile-blurb,
.tile--wide .tile-blurb { display: block; }
.tile--lead .tile-text { max-width: 46%; }
.tile--lead .tile-blurb { max-width: 14rem; }
.tile--lead .tile-go { left: 1.9rem; bottom: 1.8rem; }
.tile--lead .tile-art { width: 72%; right: -12%; bottom: -10%; }
.tile--wide .tile-text { max-width: 52%; }
.tile--wide .tile-art { width: 236px; right: -1.2rem; bottom: -1.2rem; }

/* ---------- Chef's picks ---------- */
.picks-section {
  background-color: var(--beige);
  background-image: radial-gradient(rgba(217, 164, 65, 0.3) 1.4px, transparent 1.5px);
  background-size: 24px 24px;
}
.picks {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(3, 1fr);
}
.pick {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.15rem;
  min-width: 0;
  padding: 1.2rem 1.4rem 1.2rem 1.2rem;
  background: var(--white);
  border: var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform 0.35s var(--ease);
}
.pick:hover { transform: translateY(-4px); }
.pick:focus-within { outline: 3px solid var(--terracotta); outline-offset: 3px; }

.pick-art {
  position: relative;
  flex: none;
  width: 108px;
  height: 108px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(59, 48, 40, 0.06);
}
/* A dashed gold ring draws around the colored disc when the card is hovered */
.pick-art::after {
  content: '';
  position: absolute;
  inset: -8px;
  z-index: 0;
  border: 1.5px dashed rgba(217, 164, 65, 0.9);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.92);
  pointer-events: none;
  transition: opacity 0.35s, transform 0.9s var(--ease);
}
.pick:hover .pick-art::after,
.pick:focus-within .pick-art::after { opacity: 1; transform: scale(1) rotate(70deg); }
/* The dish photo is larger than its disc, so it pops out of the circle */
.pick-dish {
  position: absolute;
  inset: -12%;
  z-index: 1;
  transition: transform 0.6s var(--ease);
}
.pick:hover .pick-dish { transform: rotate(10deg) scale(1.06); }
/* float wrapper moves; the shadow sits on the still image inside it */
.pick-float {
  display: block;
  width: 100%;
  height: 100%;
  will-change: transform;
  animation: pick-bob var(--dur, 7s) ease-in-out var(--delay, 0s) infinite;
}
.pick-photo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  filter: drop-shadow(0 8px 9px rgba(59, 48, 40, 0.28));
}
.pick-dish :deep(.dish-art) { filter: drop-shadow(0 8px 9px rgba(59, 48, 40, 0.25)); }
@keyframes pick-bob {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -6px, 0); }
}
@keyframes pick-spin {
  to { transform: rotate(360deg); }
}

.pick-body { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.pick-badge {
  align-self: flex-start;
  margin-bottom: 0.4rem;
  padding: 0.1rem 0.7rem;
  font-size: 0.74rem;
  font-weight: 600;
  border-radius: 999px;
  background: color-mix(in srgb, var(--terracotta) 16%, var(--white));
  color: var(--terracotta-dark);
}
.pick h3 { margin: 0 0 0.3rem; font-size: 1.15rem; }
.pick-link { color: inherit; text-decoration: none; }
.pick-link::after { content: ''; position: absolute; inset: 0; border-radius: inherit; }
.pick-link:focus-visible { outline: none; }
.pick-desc {
  margin: 0 0 0.75rem;
  font-size: 0.86rem;
  line-height: 1.5;
  opacity: 0.82;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.pick-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: auto 0 0;
}
.pick-cat {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.3;
  color: var(--terracotta-dark);
}
.pick-cat::before {
  content: '';
  flex: none;
  width: 0.36rem;
  height: 0.36rem;
  background: var(--gold);
  transform: rotate(45deg);
}
.pick-price {
  padding: 0.2rem 0.8rem;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 999px;
  background: var(--terracotta);
  color: var(--white);
}

.pick--lead {
  grid-column: span 2;
  grid-row: span 2;
  min-height: 300px;
  padding: 2.4rem 2.4rem;
  overflow: hidden;
  isolation: isolate;
  border: 0;
  color: var(--cream);
  background:
    radial-gradient(circle at 88% 30%, rgba(122, 41, 37, 0.5), transparent 52%),
    var(--brown);
  box-shadow: var(--shadow);
}
.pick--lead .pick-art {
  position: absolute;
  right: -4.5rem;
  top: 50%;
  width: 400px;
  height: 400px;
  margin-top: -200px;
  z-index: -1;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.14), transparent 68%);
  box-shadow: none;
}
.pick--lead .pick-art::after {
  inset: 3%;
  opacity: 0.5;
  transform: none;
  border-color: rgba(217, 164, 65, 0.75);
  will-change: transform;
  animation: pick-spin 80s linear infinite;
  transition: none;
}
.pick--lead:hover .pick-art::after { transform: none; }
.pick--lead .pick-dish { inset: 4%; }
.pick--lead .pick-photo { filter: drop-shadow(0 18px 20px rgba(0, 0, 0, 0.4)); }
.pick--lead .pick-body { max-width: 50%; flex: none; }
.pick--lead h3 { font-size: clamp(1.6rem, 2.8vw, 2.1rem); color: var(--white); }
.pick--lead .pick-desc { font-size: 0.98rem; opacity: 0.9; -webkit-line-clamp: 3; line-clamp: 3; }
.pick--lead .pick-badge { background: rgba(248, 241, 229, 0.16); color: var(--cream); }
.pick--lead .pick-cat { color: #e6b79c; }
.pick--lead .pick-foot { justify-content: flex-start; gap: 1rem; }

/* ---------- Experience ---------- */
.experience {
  display: grid;
  gap: 4rem;
  grid-template-columns: 0.85fr 1.15fr;
  align-items: center;
}
/* An arched window onto the table; photos are cropped by its edge on purpose */
.spread {
  position: relative;
  width: 100%;
  max-width: 440px;
  aspect-ratio: 4 / 5;
  margin-inline: auto;
  overflow: hidden;
  border-radius: 999px 999px 28px 28px;
  background:
    radial-gradient(circle at 30% 18%, #B5483A 0%, var(--terracotta) 42%, var(--terracotta-dark) 100%);
  box-shadow: var(--shadow);
}
.spread::after {
  content: '';
  position: absolute;
  inset: 14px;
  border: 2px dashed rgba(248, 241, 229, 0.5);
  border-radius: 999px 999px 16px 16px;
  pointer-events: none;
  z-index: 0;
}
.spread-img {
  position: absolute;
  z-index: 1;
  height: auto;
  max-width: none;
  filter: drop-shadow(0 12px 14px rgba(59, 48, 40, 0.35));
  user-select: none;
}
.spread-flan { width: 46%; right: -4%; top: 15%; }
.spread-adobo { width: 80%; left: -18%; bottom: -10%; }
.spread-tsokolate { width: 36%; right: 6%; bottom: 7%; }

.experience-intro p:not(.kicker) { font-size: 1.05rem; max-width: 30rem; margin-bottom: 1.5rem; }
.perks { list-style: none; margin: 0; padding: 0; }
.perk {
  display: flex;
  align-items: flex-start;
  gap: 1.1rem;
  padding: 1.25rem 0;
  border-top: 2px dashed rgba(217, 164, 65, 0.6);
}
.perk:last-child { border-bottom: 2px dashed rgba(217, 164, 65, 0.6); }
.perk h3 { margin: 0 0 0.2rem; }
.perk p { margin: 0; opacity: 0.85; }
.perk-icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--beige);
  color: var(--terracotta-dark);
  transition: background-color 0.3s, color 0.3s;
}

.perk:hover .perk-icon { background: var(--terracotta); color: var(--white); }
.perk-icon svg,
.ticket-icon svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ---------- Reservation steps: tickets ---------- */
.tickets {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 2.25rem;
  grid-template-columns: repeat(3, 1fr);
}
.tickets::before {
  content: '';
  position: absolute;
  left: 12%;
  right: 12%;
  top: 54px;
  border-top: 2px dashed var(--terracotta);
  opacity: 0.55;
}
.ticket {
  position: relative;
  z-index: 1;
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
/* Notches where the stub tears off */
.ticket::before,
.ticket::after {
  content: '';
  position: absolute;
  top: 96px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--beige);
}
.ticket::before { left: -11px; }
.ticket::after { right: -11px; }
.ticket-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 108px;
  padding: 0 1.6rem;
  border-bottom: 2px dashed #d9c9b0;
}
.ticket-num {
  font-family: var(--font-display);
  font-size: 3.2rem;
  font-weight: 700;
  line-height: 1;
  color: var(--terracotta);
}
.ticket-icon {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--terracotta) 14%, var(--white));
  color: var(--terracotta-dark);
}
.ticket-body { padding: 1.4rem 1.6rem 1.7rem; }
.ticket-body h3 { margin-bottom: 0.4rem; }
.ticket-body p { margin: 0; opacity: 0.85; }

/* ---------- Call to action ---------- */
.cta-section {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 7rem 0 5.5rem;
  background: var(--terracotta);
  color: var(--cream);
}
.cta-section::before,
.cta-section::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
.cta-section::before {
  background:
    radial-gradient(540px 440px at 78% 50%, rgba(217, 164, 65, 0.22), transparent 70%),
    radial-gradient(420px 320px at 4% 110%, rgba(59, 48, 40, 0.5), transparent 70%);
}
/* Banig / inabel-style diamond weave, fading in from the left */
.cta-section::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 1 39 20 20 39 1 20Z' fill='none' stroke='%23D9A441' stroke-opacity='.34' stroke-width='1.2'/%3E%3Cpath d='M20 11 29 20 20 29 11 20Z' fill='%23D9A441' fill-opacity='.2'/%3E%3C/svg%3E");
  background-size: 40px 40px;
  -webkit-mask-image: linear-gradient(90deg, transparent 30%, #000 95%);
  mask-image: linear-gradient(90deg, transparent 30%, #000 95%);
}
.cta {
  position: relative;
  display: grid;
  gap: 3rem;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
}
.eyebrow {
  display: inline-block;
  margin: 0 0 0.9rem;
  padding: 0.2rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
  border: 1px solid rgba(217, 164, 65, 0.7);
  border-radius: 999px;
}
.cta-copy h2 { font-size: clamp(2rem, 4.4vw, 3.2rem); color: var(--cream); }
.cta-copy > p:not(.eyebrow) { max-width: 26rem; margin-bottom: 1.75rem; font-size: 1.08rem; }
.cta-section .btn--light::before { background: var(--gold); }
.cta-section .btn--light:hover { color: var(--brown); border-color: var(--gold); }

.cta-art {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  margin-inline: auto;
}
.cta-disc {
  position: absolute;
  inset: 6%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 28%, rgba(217, 164, 65, 0.3), rgba(217, 164, 65, 0.06) 62%);
  box-shadow: inset 0 0 0 1px rgba(217, 164, 65, 0.45);
}
.cta-ring {
  position: absolute;
  inset: 0;
  border: 2px dashed rgba(217, 164, 65, 0.7);
  border-radius: 50%;
  will-change: transform;
  animation: cta-spin 80s linear infinite;
}
.cta-plate { position: absolute; }
.cta-float {
  width: 100%;
  height: 100%;
  will-change: transform;
  animation: float var(--dur) ease-in-out infinite;
}
.cta-float img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* shadow sits on the static image, never on the moving wrapper */
  filter: drop-shadow(0 12px 14px rgba(59, 48, 40, 0.45));
}
.plate-a { width: 56%; left: 3%; top: 8%; }
.plate-b { width: 42%; right: 1%; top: 34%; }
.plate-c { width: 38%; left: 24%; bottom: 1%; }

/* Seal: a decorative tagline ring around a golden sun. The lettering turns as a
   whole <svg> (composited); the sun stays still. It is not a link, so this
   section has a single call to action. */
.cta-seal {
  position: absolute;
  right: -5%;
  top: -2%;
  width: 128px;
  height: 128px;
}
.cta-seal svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.seal-ring {
  will-change: transform;
  animation: cta-spin 24s linear infinite;
}
.seal-ring text {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.4px;
  fill: var(--gold);
}
.seal-disc { fill: var(--gold); }
.seal-sun { fill: var(--terracotta); }
.seal-rays line {
  stroke: var(--terracotta);
  stroke-width: 3.2;
  stroke-linecap: round;
}

/* Banderitas: one fiesta garland draped across the top. It is wider than a phone
   screen, so on small screens the ends run off the edges and it still hangs.
   It sways with a cheap transform only. */
.garlands {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  z-index: 2;
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
  animation: garland-sway 8s ease-in-out infinite alternate;
}
.garlands--light .garland { background-image: url('../assets/garland-light.svg'); }
.garlands--dark .garland { background-image: url('../assets/garland-dark.svg'); }
.cta-section .garlands { z-index: 1; }
@keyframes garland-sway {
  from { transform: rotate(-0.25deg); }
  to { transform: rotate(0.25deg); }
}
@keyframes cta-spin {
  to { transform: rotate(360deg); }
}

/* ---------- Responsive ---------- */
@media (max-width: 1040px) {
  .picks { grid-template-columns: repeat(2, 1fr); }
  .pick--lead { grid-row: auto; min-height: 250px; padding: 2rem; }
  .pick--lead .pick-art { width: 320px; height: 320px; margin-top: -160px; right: -3rem; }
  .picks .pick:last-child { grid-column: span 2; }
  .experience { gap: 2.5rem; }
}

@media (max-width: 960px) {
  .bento {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      'pasta pasta'
      'app rice'
      'main bread'
      'hot iced'
      'dess bev';
  }
  .tile--lead { min-height: 300px; }
  .tile--lead .tile-art { width: min(62%, 300px); }
  .tile--wide .tile-art { width: 224px; }
  .tickets::before { display: none; }
  .tickets { grid-template-columns: 1fr; max-width: 520px; gap: 1.5rem; }
}

@media (max-width: 860px) {
  .hero { padding: 2rem 0 5.5rem; }
  .hero-wash {
    background:
      radial-gradient(circle at 70% 75%, rgba(122, 41, 37, 0.2), transparent 60%),
      linear-gradient(180deg, rgba(248, 241, 229, 0.93) 0%, rgba(248, 241, 229, 0.78) 100%);
  }
  .hero-grid,
  .experience,
  .cta { grid-template-columns: 1fr; }
  .hero-grid { gap: 2rem; }
  .experience { gap: 2.5rem; }
  .spread { max-width: 360px; }
  .cta-seal { width: 100px; height: 100px; right: 0; top: -3%; }
  .cta-art { max-width: 320px; }
  .cta-section { padding: 5.5rem 0 4rem; }
}

@media (max-width: 680px) {
  .section-heading--row { flex-direction: column; align-items: flex-start; }
  .picks { grid-template-columns: 1fr; }
  .pick--lead,
  .picks .pick:last-child { grid-column: auto; }
  .pick--lead { flex-direction: column; align-items: flex-start; min-height: 0; padding: 1.5rem; }
  .pick--lead .pick-art {
    position: relative;
    right: auto;
    top: auto;
    width: 190px;
    height: 190px;
    margin: 0 0 0.25rem -0.4rem;
    z-index: 0;
  }
  .pick--lead .pick-body { max-width: none; }
}

@media (max-width: 480px) {
  .bento { gap: 0.8rem; grid-auto-rows: minmax(170px, auto); }
  .tile { min-height: 170px; padding: 1rem; }
  .tile-name { font-size: 1.12rem; }
  .tile-go { left: 1rem; bottom: 0.95rem; width: 34px; height: 34px; }
  .tile-text { max-width: 78%; }
  .tile--lead { min-height: 270px; padding: 1.25rem; }
  .tile--lead .tile-text { max-width: 70%; }
  .tile--lead .tile-go { left: 1.25rem; bottom: 1.2rem; }
  .tile--wide { min-height: 200px; }
  .tile--wide .tile-text { max-width: 62%; }
  .tile--wide .tile-art { width: 190px; }
  .pick { padding: 1rem; gap: 0.9rem; }
  .pick-art { width: 92px; height: 92px; }
}

@media (prefers-reduced-motion: reduce) {
  .squiggle path { stroke-dashoffset: 0; }
  .hero-photo,
  .bokeh,
  .cta-ring,
  .seal-ring,
  .garland,
  .pick-float,
  .pick--lead .pick-art::after,
  .cta-float { will-change: auto; animation: none; }
}
</style>
