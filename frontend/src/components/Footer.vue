<script setup>
import { restaurantInfo } from '../data/restaurantInfo'
import { categories } from '../data/menuItems'
import logoLight from '../assets/logo-light.webp'

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Our Menu' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

const socialLinks = restaurantInfo.socialLinks.filter((link) => link.url)
const year = new Date().getFullYear()

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="footer">
    <div class="footer-wave" aria-hidden="true">
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" focusable="false">
        <path d="M0 48V24C120 6 240 2 360 14s240 30 360 22 240-34 360-30 240 18 360 26V48Z" />
      </svg>
    </div>

    <div class="container footer-grid">
      <div class="footer-brand">
        <RouterLink to="/" class="footer-logo" aria-label="HapagPinoy home">
          <img class="footer-logo-img" :src="logoLight" alt="HapagPinoy" width="1165" height="208" loading="lazy" decoding="async" />
        </RouterLink>
        <p>Sarap at saya sa bawat hapag. Browse our menu and plan your next visit.</p>
        <RouterLink to="/reservations" class="btn btn--light footer-btn">Book a table</RouterLink>
        <ul v-if="socialLinks.length" class="footer-list social">
          <li v-for="link in socialLinks" :key="link.label">
            <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
          </li>
        </ul>
      </div>

      <nav aria-label="Footer navigation">
        <h3>Explore</h3>
        <ul class="footer-list">
          <li v-for="link in links" :key="link.to">
            <RouterLink :to="link.to" class="arrow-link">{{ link.label }}</RouterLink>
          </li>
        </ul>
      </nav>

      <nav aria-label="Menu categories">
        <h3>On the menu</h3>
        <ul class="footer-list">
          <li v-for="category in categories" :key="category.name">
            <RouterLink :to="{ path: '/menu', query: { category: category.name } }" class="arrow-link">
              {{ category.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div>
        <h3>Visit us</h3>
        <address class="footer-address">
          <p class="contact-line">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span>{{ restaurantInfo.address }}</span>
          </p>
          <p class="contact-line">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
            </svg>
            <a :href="`tel:${restaurantInfo.phone.replace(/\s/g, '')}`">{{ restaurantInfo.phone }}</a>
          </p>
          <p class="contact-line">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <a :href="`mailto:${restaurantInfo.email}`">{{ restaurantInfo.email }}</a>
          </p>
        </address>
        <p class="sample-note">Sample details. Replace before launch.</p>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>&copy; {{ year }} HapagPinoy. A school project.</p>
      <button type="button" class="to-top" @click="backToTop">
        Back to top
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V6M6 12l6-6 6 6" /></svg>
      </button>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background: var(--brown);
  color: var(--beige);
  padding-top: 3.5rem;
  font-size: 0.92rem;
}
.footer-wave {
  position: absolute;
  left: 0;
  right: 0;
  top: -47px;
  height: 48px;
  line-height: 0;
  pointer-events: none;
}
.footer-wave svg { width: 100%; height: 100%; display: block; }
.footer-wave path { fill: var(--brown); }

.footer-grid {
  display: grid;
  gap: 2.5rem;
  grid-template-columns: 1.4fr 0.8fr 0.9fr 1.3fr;
  padding-bottom: 3rem;
}
.footer h3 {
  position: relative;
  margin-bottom: 1.1rem;
  padding-bottom: 0.7rem;
  font-size: 1.1rem;
  color: var(--white);
}
.footer h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 28px;
  height: 3px;
  background: var(--terracotta);
  border-radius: 3px;
}

.footer a:not(.btn):not(.footer-logo) {
  color: var(--beige);
  text-decoration: none;
  background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
  transition: background-size 0.3s var(--ease), color 0.2s;
}
.footer a:not(.btn):not(.footer-logo):hover { color: var(--white); background-size: 100% 1px; }

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.9rem;
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--white);
  text-decoration: none;
}
.footer-logo-img { display: block; height: 44px; width: auto; max-width: 100%; transition: transform 0.6s var(--ease); }
.footer-logo:hover .footer-logo-img { transform: scale(1.03); }
.footer-brand p { max-width: 20rem; }
.footer-btn { margin-top: 0.4rem; padding: 0.6rem 1.4rem; }

.footer-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.55rem; }
.social { margin-top: 1.25rem; grid-auto-flow: column; justify-content: start; gap: 1.25rem; }

.arrow-link { display: inline-block; transition: transform 0.3s var(--ease), color 0.2s; }
.arrow-link:hover { transform: translateX(5px); }

.footer-address { font-style: normal; display: grid; gap: 0.85rem; }
.footer-address p { margin: 0; }
.contact-line { display: flex; align-items: flex-start; gap: 0.7rem; }
.contact-line svg {
  flex: none;
  width: 18px;
  height: 18px;
  margin-top: 0.2rem;
  fill: none;
  stroke: #D9A441;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.sample-note { margin: 1rem 0 0; font-size: 0.8rem; opacity: 0.75; }

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid rgba(232, 220, 203, 0.25);
  padding: 1.2rem 0;
  font-size: 0.85rem;
}
.footer-bottom p { margin: 0; }
.to-top {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.5rem 0.45rem 1rem;
  font: inherit;
  font-weight: 500;
  color: var(--beige);
  background: transparent;
  border: 1px solid rgba(232, 220, 203, 0.4);
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
}
.to-top svg {
  width: 28px;
  height: 28px;
  padding: 5px;
  fill: none;
  stroke: var(--white);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  background: var(--terracotta);
  border-radius: 50%;
  transition: transform 0.3s var(--ease);
}
.to-top:hover { color: var(--white); border-color: var(--terracotta); }
.to-top:hover svg { transform: translateY(-3px); }

@media (max-width: 960px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .footer-grid { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; align-items: flex-start; }
}
</style>
