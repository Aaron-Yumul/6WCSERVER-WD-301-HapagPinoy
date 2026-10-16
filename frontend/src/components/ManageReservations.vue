<script setup>
import { onMounted, reactive, ref } from 'vue'
import ReservationManager from './ReservationManager.vue'
import { getReservation } from '../api/reservations'
import { forgetReservation, loadSaved } from '../utils/myReservations'
import { formatLongDate, formatTime } from '../utils/hours'

// "My reservations": bookings made in this browser, plus a lookup by reference code and email.
const form = reactive({ reference: '', email: '' })
const errors = reactive({})
const lookupError = ref('')
const looking = ref(false)

const deviceList = ref([]) // { reference, token, status: 'loading' | 'ok' | 'error', reservation, message }
const selected = ref(null) // { reservation, auth }

onMounted(async () => {
  deviceList.value = loadSaved().map((entry) => ({ ...entry, status: 'loading', reservation: null, message: '' }))
  await Promise.all(
    deviceList.value.map(async (entry) => {
      try {
        entry.reservation = await getReservation(entry.reference, { token: entry.token })
        entry.status = 'ok'
      } catch (error) {
        if (error.status === 404) {
          forgetReservation(entry.reference) // it no longer exists
          deviceList.value = deviceList.value.filter((other) => other.reference !== entry.reference)
        } else {
          entry.status = 'error'
          entry.message = error.message
        }
      }
    }),
  )
})

async function find() {
  Object.keys(errors).forEach((key) => delete errors[key])
  lookupError.value = ''
  const reference = form.reference.trim().toUpperCase()
  const email = form.email.trim()
  if (!reference) errors.reference = 'Enter your reference code, like HP-7K3M9Q.'
  else if (!/^HP-[A-Z0-9]{6}$/.test(reference)) errors.reference = 'A reference code looks like HP-7K3M9Q.'
  if (!email) errors.email = 'Enter the email you used to book.'
  if (Object.keys(errors).length) {
    document.querySelector('[aria-invalid="true"]')?.focus()
    return
  }

  looking.value = true
  try {
    const reservation = await getReservation(reference, { email })
    selected.value = { reservation, auth: { email } }
  } catch (error) {
    lookupError.value = error.message
  } finally {
    looking.value = false
  }
}

function open(entry) {
  selected.value = { reservation: entry.reservation, auth: { token: entry.token } }
}

function onChanged(updated) {
  const entry = deviceList.value.find((item) => item.reference === updated.reference)
  if (entry) entry.reservation = updated
}

function back() {
  selected.value = null
}

function summary(reservation) {
  return `${formatLongDate(reservation.date)}, ${formatTime(reservation.time)} for ${reservation.guests}`
}
</script>

<template>
  <div class="manage">
    <template v-if="selected">
      <button type="button" class="back" @click="back">&larr; Back to my reservations</button>
      <ReservationManager :key="selected.reservation.reference" :reservation="selected.reservation" :auth="selected.auth" @changed="onChanged" />
    </template>

    <template v-else>
      <section aria-labelledby="find-title" class="block">
        <p class="kicker">Hanapin ang reserba</p>
        <h2 id="find-title">Find a reservation</h2>
        <p>Enter the reference code from your confirmation and the email you booked with. From there you can edit or cancel it.</p>

        <form class="form" novalidate @submit.prevent="find">
          <p v-if="lookupError" class="notice notice--error" role="alert">{{ lookupError }}</p>
          <div class="form-row">
            <div class="field" :class="{ 'has-error': errors.reference }">
              <label for="find-reference">Reference code</label>
              <input id="find-reference" v-model="form.reference" type="text" placeholder="HP-7K3M9Q" autocapitalize="characters" autocomplete="off"
                :aria-invalid="!!errors.reference" :aria-describedby="errors.reference ? 'find-reference-error' : undefined" />
              <p v-if="errors.reference" id="find-reference-error" class="error-text">{{ errors.reference }}</p>
            </div>
            <div class="field" :class="{ 'has-error': errors.email }">
              <label for="find-email">Email address</label>
              <input id="find-email" v-model="form.email" type="email" autocomplete="email"
                :aria-invalid="!!errors.email" :aria-describedby="errors.email ? 'find-email-error' : undefined" />
              <p v-if="errors.email" id="find-email-error" class="error-text">{{ errors.email }}</p>
            </div>
          </div>
          <div class="btn-row">
            <button type="submit" class="btn" :disabled="looking">{{ looking ? 'Searching...' : 'Find my reservation' }}</button>
          </div>
        </form>
      </section>

      <section v-if="deviceList.length" aria-labelledby="device-title" class="block">
        <h2 id="device-title">Booked on this device</h2>
        <ul class="device-list">
          <li v-for="entry in deviceList" :key="entry.reference">
            <button v-if="entry.reservation" type="button" class="device-item" @click="open(entry)">
              <span class="device-main">
                <strong>{{ entry.reference }}</strong>
                <span>{{ summary(entry.reservation) }}</span>
              </span>
              <span class="device-status" :class="`device-status--${entry.reservation.status}`">
                {{ entry.reservation.status === 'cancelled' ? 'Cancelled' : entry.reservation.isPast ? 'Completed' : 'Confirmed' }}
              </span>
            </button>
            <div v-else class="device-item device-item--plain">
              <span class="device-main">
                <strong>{{ entry.reference }}</strong>
                <span>{{ entry.status === 'loading' ? 'Loading...' : entry.message }}</span>
              </span>
            </div>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.manage { display: grid; gap: 2rem; }
.block { display: grid; gap: 1rem; }
.block h2 { margin: 0; }
.block p { margin: 0; }
.back {
  justify-self: start;
  font: inherit;
  font-size: 0.9rem;
  padding: 0;
  border: 0;
  background: none;
  color: var(--terracotta);
  cursor: pointer;
  text-decoration: underline;
}
.device-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.6rem; }
.device-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  font: inherit;
  text-align: left;
  color: var(--brown);
  border: 1.5px solid var(--beige);
  border-radius: var(--radius);
  background: var(--white);
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s;
}
button.device-item:hover { border-color: var(--terracotta); }
button.device-item:active { transform: scale(0.99); }
.device-item--plain { cursor: default; }
.device-main { display: grid; font-size: 0.9rem; }
.device-main strong { font-size: 1rem; letter-spacing: 0.05em; }
.device-status { flex: none; padding: 0.2rem 0.7rem; border-radius: 999px; font-size: 0.78rem; font-weight: 600; background: #e7f2e9; color: #1f4a2b; }
.device-status--cancelled { background: #fbeaea; color: #7a1f1f; }
</style>
