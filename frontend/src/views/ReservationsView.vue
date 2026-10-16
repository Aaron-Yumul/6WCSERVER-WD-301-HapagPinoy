<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import HoursList from '../components/HoursList.vue'
import ReservationForm from '../components/ReservationForm.vue'
import ReservationManager from '../components/ReservationManager.vue'
import ManageReservations from '../components/ManageReservations.vue'
import imgBulalo from '../assets/picks/bulalo.webp'
import imgHalo from '../assets/picks/halo-halo.webp'
import { describeMinutes } from '../utils/hours'
import { saveReservation } from '../utils/myReservations'
import { cutoffHours, slotLengthMinutes, lastSeatingBeforeCloseMinutes, maxOnlineGuests } from '../data/schedule'

const route = useRoute()

const tab = ref(route.query.tab === 'manage' ? 'manage' : 'book')
const created = ref(null) // { reservation, auth } right after a successful booking

function showTab(name) {
  tab.value = name
}

function onSaved({ reservation, manageToken }) {
  // The browser keeps the secret token, so this guest can edit or cancel later without typing the code.
  saveReservation(reservation.reference, manageToken)
  created.value = { reservation, auth: { token: manageToken } }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function makeAnother() {
  created.value = null
}
</script>

<template>
  <div class="page">
    <PageHeader
      eyebrow="Magpareserba"
      title="Reserve your hapag"
      accent="hapag"
      text="Choose a day, a time and how many are coming. Pre-order your meal if you like, and cancel online anytime before the deadline."
      art="bowl"
      tone="#D08A3C"
      :image="imgBulalo"
      :image2="imgHalo"
    />

    <section class="section">
      <div class="container reservation-layout">
        <div class="card form-card ornate">
          <div class="tabs" role="tablist" aria-label="Reservations">
            <button id="tab-book" type="button" role="tab" class="tab" :class="{ active: tab === 'book' }"
              :aria-selected="tab === 'book'" aria-controls="panel-book" @click="showTab('book')">Book a table</button>
            <button id="tab-manage" type="button" role="tab" class="tab" :class="{ active: tab === 'manage' }"
              :aria-selected="tab === 'manage'" aria-controls="panel-manage" @click="showTab('manage')">My reservations</button>
          </div>

          <div v-if="tab === 'book'" id="panel-book" role="tabpanel" aria-labelledby="tab-book">
            <div v-if="created">
              <ReservationManager
                :key="created.reservation.reference"
                :reservation="created.reservation"
                :auth="created.auth"
                banner="Your table is reserved"
              />
              <div class="btn-row after">
                <button type="button" class="btn btn--outline" @click="makeAnother">Make another reservation</button>
                <RouterLink to="/menu" class="btn btn--outline">Browse the menu</RouterLink>
              </div>
            </div>
            <ReservationForm v-else @saved="onSaved" />
          </div>

          <div v-else id="panel-manage" role="tabpanel" aria-labelledby="tab-manage">
            <ManageReservations />
          </div>
        </div>

        <aside class="card side-card ornate">
          <p class="kicker">Oras ng Pagbubukas</p>
          <h2>Opening hours</h2>
          <HoursList />

          <h3 class="good-title">Good to know</h3>
          <ul class="good-list">
            <li>Tables can be booked every {{ describeMinutes(slotLengthMinutes) }}.</li>
            <li>Last seating is {{ describeMinutes(lastSeatingBeforeCloseMinutes) }} before closing.</li>
            <li>Online bookings are for 1 to {{ maxOnlineGuests }} guests.</li>
            <li>Book at least {{ cutoffHours }} hours ahead. You can change or cancel online until {{ cutoffHours }} hours before.</li>
            <li>Pre-ordering is optional. Your dishes are paid for at the restaurant.</li>
            <li>Tell us about birthdays, high chairs or allergies in the special requests box.</li>
          </ul>
          <p class="side-note">
            Coming with {{ maxOnlineGuests + 1 }} or more?
            <RouterLink :to="{ path: '/contact', query: { topic: 'group' } }">Send us a message</RouterLink>
            and we'll sort it out.
          </p>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.reservation-layout {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1.7fr 1fr;
  align-items: start;
}
.form-card,
.side-card { padding: 2.75rem 2.25rem 2.25rem; }
.side-card { position: sticky; top: 90px; }
.side-card h2 { font-size: 1.5rem; }
.side-note { margin: 1.25rem 0 0; font-size: 0.9rem; }

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
  padding: 0.3rem;
  border-radius: 999px;
  background: var(--cream);
  border: 1px solid var(--beige);
}
.tab {
  flex: 1;
  font: inherit;
  font-weight: 600;
  font-size: 0.92rem;
  padding: 0.6rem 1rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--brown);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tab:hover:not(.active) { background: var(--beige); }
.tab.active { background: var(--terracotta); color: var(--white); }
.after { margin-top: 1.5rem; }

.good-title { margin-top: 1.75rem; font-size: 1.1rem; }
.good-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.6rem;
  font-size: 0.92rem;
}
.good-list li {
  position: relative;
  padding-left: 1.4rem;
}
.good-list li::before {
  content: '';
  position: absolute;
  left: 0.15rem;
  top: 0.55em;
  width: 0.5rem;
  height: 0.5rem;
  background: var(--gold);
  transform: rotate(45deg);
}

@media (max-width: 900px) {
  .reservation-layout { grid-template-columns: 1fr; }
  .side-card { position: static; }
}
@media (max-width: 480px) {
  .form-card,
  .side-card { padding: 2rem 1.25rem 1.25rem; }
}
</style>
