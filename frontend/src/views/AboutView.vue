<script setup>
import PageHeader from '../components/PageHeader.vue'
import imgUbe from '../assets/picks/ube-pandesal.webp'
import imgLatte from '../assets/picks/spanish-latte.webp'
import SpacePhoto from '../components/SpacePhoto.vue'
import HoursList from '../components/HoursList.vue'
import { restaurantInfo } from '../data/restaurantInfo'

const [mainPhoto, cornerPhoto, dinnerPhoto] = restaurantInfo.spacePhotos

// Three meal moments, each linking to the matching menu category.
// "icon" is an SVG path (24x24, stroke only).
const moments = [
  {
    local: 'Tanghalian',
    english: 'Lunch',
    text: 'Rice meals with all the favorites, from chicken adobo to pork sisig.',
    category: 'Rice Meals',
    cta: 'See rice meals',
    icon: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  },
  {
    local: 'Merienda',
    english: 'Afternoon snack',
    text: 'Halo-halo, turon or bibingka, best with a cup of kapeng barako.',
    category: 'Desserts',
    cta: 'See desserts',
    icon: 'M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 2v3M12 2v3',
  },
  {
    local: 'Hapunan',
    english: 'Dinner',
    text: 'Kare-kare, sinigang and bulalo, made for sharing at the table.',
    category: 'Main Courses',
    cta: 'See main courses',
    icon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  },
]
</script>

<template>
  <div class="page">
    <PageHeader
      eyebrow="Tungkol sa Amin"
      title="Isang hapag, maraming kuwento"
      accent="maraming kuwento"
      text="One table, many stories. HapagPinoy is a neighborhood restaurant built around good food and good company."
      art="bread"
      tone="toast"
      :image="imgUbe"
      :image2="imgLatte"
    />

    <section class="section">
      <div class="container split">
        <div v-reveal>
          <p class="kicker">Ang Aming Hapag</p>
          <h2>Cooking with care</h2>
          <p>
            HapagPinoy takes its name from hapag, the Filipino dining table. We cook the
            dishes many of us grew up with, from adobo and sinigang to pandesal and halo-halo,
            using fresh ingredients and serving them the way you would at a family table.
          </p>
          <p>
            Whether you are celebrating a special day or stopping by after work, our team
            makes sure your visit feels comfortable from the first greeting to the last bite.
          </p>
          <p class="sample-note">This story is sample text. Replace it with the real restaurant background.</p>
        </div>
        <div class="split-photo" v-reveal="{ delay: 120 }">
          <SpacePhoto v-bind="mainPhoto" />
          <aside class="word-card" aria-label="What the name HapagPinoy means">
            <p class="word-kicker">Ang pangalan namin</p>
            <dl class="words">
              <div><dt>hapag <abbr title="noun">n.</abbr></dt><dd>the dining table</dd></div>
              <div><dt>Pinoy <abbr title="noun">n.</abbr></dt><dd>a Filipino</dd></div>
            </dl>
            <p class="word-sum">HapagPinoy: a Filipino table, set for you.</p>
          </aside>
        </div>
      </div>
    </section>

    <section class="section section--beige">
      <div class="container values">
        <div class="value value--brown ornate" v-reveal>
          <p class="kicker kicker--light">Misyon</p>
          <h2>Our mission</h2>
          <p>To serve honest, delicious food in a welcoming space where every guest feels at home.</p>
        </div>
        <div class="value value--white ornate" v-reveal="{ delay: 120 }">
          <p class="kicker">Bisyon</p>
          <h2>Our vision</h2>
          <p>To become a favorite gathering place for families and friends, known for good food and genuine hospitality.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-heading" v-reveal>
          <p class="kicker">Buong Araw</p>
          <h2>A hapag for every hour</h2>
          <p>From a hearty lunch to afternoon merienda and a family dinner, there is always something good on the table.</p>
        </div>
        <div class="moments">
          <div v-for="(moment, index) in moments" :key="moment.local" class="moment-wrap" v-reveal="{ delay: index * 100 }">
            <RouterLink :to="{ path: '/menu', query: { category: moment.category } }" class="moment card">
              <span class="moment-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" focusable="false">
                  <path :d="moment.icon" />
                </svg>
              </span>
              <p class="kicker">{{ moment.local }}</p>
              <h3>{{ moment.english }}</h3>
              <p class="moment-text">{{ moment.text }}</p>
              <span class="moment-cta">{{ moment.cta }} <span aria-hidden="true">&rarr;</span></span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--beige">
      <div class="container">
        <div class="section-heading" v-reveal>
          <p class="kicker">Ang Karanasan</p>
          <h2>The dining experience</h2>
          <p>Comfortable seating, a relaxed room and a menu with something for everyone, from pandesal and barako coffee to a late dinner.</p>
        </div>
        <div class="bento">
          <div class="bento-tall" v-reveal><SpacePhoto v-bind="cornerPhoto" /></div>
          <div class="bento-wide" v-reveal="{ delay: 100 }"><SpacePhoto v-bind="dinnerPhoto" /></div>
          <div class="bento-note ornate" v-reveal="{ delay: 200 }">
            <p class="kicker kicker--light">Tuloy po kayo!</p>
            <h3>Come as you are</h3>
            <p>Tables for couples, groups and families. Tell us about special requests when you reserve.</p>
            <RouterLink to="/reservations" class="btn btn--light">Book a table</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container info-layout">
        <div v-reveal>
          <p class="kicker">Hanapin Kami</p>
          <h2>Find us</h2>
          <address class="address">
            <p>{{ restaurantInfo.address }}</p>
            <p><a :href="`tel:${restaurantInfo.phone.replace(/\s/g, '')}`">{{ restaurantInfo.phone }}</a></p>
            <p><a :href="`mailto:${restaurantInfo.email}`">{{ restaurantInfo.email }}</a></p>
          </address>
          <p class="sample-note">Sample contact details.</p>
          <div class="btn-row">
            <RouterLink to="/menu" class="btn">View our menu</RouterLink>
            <RouterLink to="/reservations" class="btn btn--outline">Book a table</RouterLink>
          </div>
        </div>
        <div class="card hours-card ornate" v-reveal="{ delay: 120 }">
          <h2>Opening hours</h2>
          <HoursList />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.split {
  display: grid;
  gap: 3.5rem;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
.split-photo { position: relative; min-height: 340px; }
.sample-note { font-size: 0.82rem; opacity: 0.75; }

/* Dictionary-style card explaining the name */
.word-card {
  position: absolute;
  top: -1.25rem;
  right: -0.75rem;
  z-index: 2;
  width: min(250px, 70%);
  padding: 1rem 1.25rem 1.1rem;
  border: 1.5px dashed var(--terracotta);
  border-radius: var(--radius);
  background: var(--cream);
  box-shadow: var(--shadow);
  transform: rotate(2deg);
}
.word-kicker {
  margin: 0 0 0.4rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--terracotta);
}
.words { margin: 0; }
.words > div { padding: 0.35rem 0; border-bottom: 1px dotted rgba(59, 48, 40, 0.3); }
.words dt {
  display: inline;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
}
.words abbr {
  margin-left: 0.25rem;
  font-size: 0.78rem;
  font-style: italic;
  text-decoration: none;
  opacity: 0.7;
}
.words dd { margin: 0; font-size: 0.92rem; }
.word-sum { margin: 0.6rem 0 0; font-size: 0.85rem; font-weight: 500; color: var(--terracotta-dark); }

.values {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1.2fr 1fr;
}
.value {
  padding: 2.75rem 2.5rem 2.5rem;
  border-radius: var(--radius-lg);
}
.value p:not(.kicker) { margin: 0; font-size: 1.05rem; }
.value--brown { background: var(--brown); color: var(--cream); }
.value--brown h2 { color: var(--white); }
.value--white { background: var(--white); border: var(--border); }

/* Meal moments */
.moments {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(3, 1fr);
}
.moment-wrap { display: flex; }
.moment {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.75rem;
  color: inherit;
  text-decoration: none;
  transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease);
}
.moment:hover { transform: translateY(-6px); box-shadow: var(--shadow); }
.moment-icon {
  display: grid;
  place-items: center;
  width: 3.2rem;
  height: 3.2rem;
  margin-bottom: 1rem;
  border-radius: 50%;
  background: var(--gold-soft);
  color: var(--terracotta);
}
.moment-icon svg { width: 1.6rem; height: 1.6rem; }
.moment h3 { margin-bottom: 0.4rem; }
.moment-text { flex: 1; font-size: 0.95rem; opacity: 0.85; }
.moment-cta {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--terracotta-dark);
}
.moment:hover .moment-cta { text-decoration: underline; }

.bento {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 260px 260px;
}
.bento-tall { grid-row: 1 / 3; }
.bento-wide { grid-column: 2 / 4; }
.bento-note {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  grid-column: 2 / 4;
  padding: 1.75rem 2rem;
  border-radius: var(--radius-lg);
  background: var(--brown);
  color: var(--cream);
}
.bento-note h3 { color: var(--white); font-size: 1.5rem; }
.bento-note p:not(.kicker) { opacity: 0.9; }

.info-layout {
  display: grid;
  gap: 3rem;
  grid-template-columns: 1fr 1fr;
  align-items: start;
}
.address { font-style: normal; }
.address p { margin-bottom: 0.4rem; }
.hours-card { padding: 2.5rem 2rem 2rem; }
.hours-card h2 { font-size: 1.5rem; }

@media (max-width: 860px) {
  .split,
  .info-layout,
  .values,
  .moments { grid-template-columns: 1fr; }
  .split { gap: 2rem; }
  .word-card { position: static; width: auto; margin-top: 1rem; transform: none; }
  .bento { grid-template-columns: 1fr; grid-template-rows: none; }
  .bento-tall,
  .bento-wide,
  .bento-note { grid-column: auto; grid-row: auto; }
  .bento-tall,
  .bento-wide { min-height: 260px; }
}
</style>
