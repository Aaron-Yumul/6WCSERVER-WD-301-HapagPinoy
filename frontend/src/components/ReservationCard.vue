<script setup>
import { computed, ref } from 'vue'
import SuccessMark from './SuccessMark.vue'
import { cancelReservation } from '../api/reservations'
import { forgetReservation } from '../utils/myReservations'
import { cutoffHours } from '../data/schedule'
import { restaurantInfo } from '../data/restaurantInfo'
import { formatPeso } from '../data/menuItems'
import { formatLongDate, formatTime } from '../utils/hours'

// Shows one booking and lets the guest cancel it (or ask to edit it).
const props = defineProps({
  reservation: { type: Object, required: true },
  auth: { type: Object, default: null }, // { token } or { email }
  banner: { type: String, default: '' }, // e.g. "Salamat! Your table is reserved."
})
const emit = defineEmits(['edit', 'changed'])

const occasionLabels = {
  birthday: 'Birthday (Kaarawan)',
  anniversary: 'Anniversary',
  family: 'Family gathering (Salu-salo)',
  barkada: 'Barkada get-together',
  business: 'Business meal',
  other: 'Other celebration',
}

const isCancelled = computed(() => props.reservation.status === 'cancelled')
const statusLabel = computed(() => {
  if (isCancelled.value) return 'Cancelled'
  return props.reservation.isPast ? 'Completed' : 'Confirmed'
})
const hasPreOrder = computed(() => props.reservation.preOrder?.items?.length > 0)
const lateForChanges = computed(() => !isCancelled.value && !props.reservation.isPast && !props.reservation.canChange)

function formatMoment(value) {
  return new Date(value).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' })
}

// ----- Copy the reference code -----
const copied = ref(false)
async function copyReference() {
  try {
    await navigator.clipboard.writeText(props.reservation.reference)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Clipboard blocked: the code is visible and can be copied by hand.
  }
}

// ----- Cancelling: ask first, then call the API -----
const confirming = ref(false)
const reason = ref('')
const cancelling = ref(false)
const cancelError = ref('')

async function confirmCancel() {
  cancelError.value = ''
  cancelling.value = true
  try {
    const updated = await cancelReservation(props.reservation.reference, { ...(props.auth || {}), reason: reason.value.trim() })
    forgetReservation(props.reservation.reference)
    confirming.value = false
    emit('changed', updated)
  } catch (error) {
    cancelError.value = error.message
  } finally {
    cancelling.value = false
  }
}
</script>

<template>
  <div class="reservation-card" role="region" :aria-label="`Reservation ${reservation.reference}`">
    <div v-if="banner && !isCancelled" class="banner" role="status">
      <SuccessMark />
      <p class="kicker">Salamat!</p>
      <h2>{{ banner }}</h2>
    </div>
    <div v-else-if="isCancelled" class="banner banner--cancelled" role="status">
      <p class="kicker">Nakansela</p>
      <h2>This reservation was cancelled</h2>
      <p v-if="reservation.cancelledAt">Cancelled on {{ formatMoment(reservation.cancelledAt) }}. The table has been released.</p>
    </div>

    <div class="ref-row">
      <div>
        <p class="ref-label">Reference code</p>
        <p class="ref-code">{{ reservation.reference }}</p>
      </div>
      <div class="ref-side">
        <span class="status" :class="`status--${isCancelled ? 'cancelled' : reservation.isPast ? 'past' : 'ok'}`">{{ statusLabel }}</span>
        <button type="button" class="btn btn--outline btn--small" @click="copyReference">{{ copied ? 'Copied' : 'Copy code' }}</button>
      </div>
    </div>

    <div class="slip">
      <ul class="summary-list">
        <li><span>Date</span><strong>{{ formatLongDate(reservation.date) }}</strong></li>
        <li><span>Time</span><strong>{{ formatTime(reservation.time) }}</strong></li>
        <li><span>Guests</span><strong>{{ reservation.guests }}</strong></li>
        <li v-if="reservation.occasion"><span>Occasion</span><strong>{{ occasionLabels[reservation.occasion] || reservation.occasion }}</strong></li>
        <li><span>Name</span><strong>{{ reservation.name }}</strong></li>
        <li><span>Email</span><strong>{{ reservation.email }}</strong></li>
        <li><span>Phone</span><strong>{{ reservation.phone }}</strong></li>
        <li v-if="reservation.requests"><span>Special requests</span><strong>{{ reservation.requests }}</strong></li>
      </ul>
    </div>

    <div v-if="hasPreOrder" class="slip">
      <h3 class="slip-title">Pre-order</h3>
      <ul class="summary-list">
        <li v-for="item in reservation.preOrder.items" :key="item.itemId">
          <span>{{ item.quantity }} &times; {{ item.name }}</span>
          <strong>{{ formatPeso(item.quantity * item.price) }}</strong>
        </li>
        <li class="total"><span>Estimated total</span><strong>{{ formatPeso(reservation.preOrder.total) }}</strong></li>
      </ul>
      <p class="slip-note">Paid at the restaurant. We will have your dishes ready when you arrive.</p>
    </div>

    <p v-if="lateForChanges" class="notice notice--warning">
      Online changes closed {{ formatMoment(reservation.changeDeadline) }} ({{ cutoffHours }} hours before your table).
      To change or cancel now, please call us at <a :href="`tel:${restaurantInfo.phone.replace(/\s/g, '')}`">{{ restaurantInfo.phone }}</a>.
    </p>

    <template v-if="reservation.canChange">
      <p v-if="!confirming" class="deadline">You can change or cancel online until {{ formatMoment(reservation.changeDeadline) }}.</p>

      <div v-if="confirming" class="confirm" role="alertdialog" aria-labelledby="cancel-title">
        <h3 id="cancel-title">Cancel this reservation?</h3>
        <p>
          Your table for {{ reservation.guests }} on {{ formatLongDate(reservation.date) }} at {{ formatTime(reservation.time) }}
          will be released<span v-if="hasPreOrder"> and the pre-order cancelled</span>. This cannot be undone, but you can always book again.
        </p>
        <div class="field">
          <label for="cancel-reason">Reason <span class="optional">(optional)</span></label>
          <input id="cancel-reason" v-model="reason" type="text" maxlength="200" placeholder="Change of plans" />
        </div>
        <p v-if="cancelError" class="notice notice--error" role="alert">{{ cancelError }}</p>
        <div class="btn-row">
          <button type="button" class="btn btn--danger" :disabled="cancelling" @click="confirmCancel">
            {{ cancelling ? 'Cancelling...' : 'Yes, cancel my reservation' }}
          </button>
          <button type="button" class="btn btn--outline" :disabled="cancelling" @click="confirming = false">Keep my reservation</button>
        </div>
      </div>

      <div v-else class="btn-row">
        <button type="button" class="btn" @click="emit('edit')">Edit reservation</button>
        <button type="button" class="btn btn--danger-outline" @click="confirming = true">Cancel reservation</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.reservation-card { display: grid; gap: 1.25rem; animation: pop 0.5s var(--ease); }
.banner h2 { margin: 0.25rem 0 0; }
.banner--cancelled p:last-child { margin: 0.4rem 0 0; opacity: 0.85; }

.ref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem 1.25rem;
  border-radius: var(--radius);
  background: var(--brown);
  color: var(--cream);
}
.ref-label { margin: 0; font-size: 0.75rem; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.75; }
.ref-code { margin: 0.1rem 0 0; font-family: var(--font-display); font-size: 1.9rem; letter-spacing: 0.08em; }
.ref-side { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.ref-side .btn--outline { border-color: var(--gold); color: var(--gold-soft); }
.ref-side .btn--outline:hover { color: var(--white); }

.status { padding: 0.25rem 0.8rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; }
.status--ok { background: #e7f2e9; color: #1f4a2b; }
.status--past { background: var(--beige); color: var(--brown); }
.status--cancelled { background: #fbeaea; color: #7a1f1f; }

.slip {
  padding: 0.25rem 1.5rem 0.75rem;
  border: 1.5px dashed var(--terracotta);
  border-radius: var(--radius);
  background: var(--cream);
}
.slip-title { margin: 1rem 0 0.25rem; font-size: 1.05rem; }
.slip-note { margin: 0.25rem 0 0; font-size: 0.85rem; opacity: 0.8; }
.summary-list { list-style: none; padding: 0; margin: 0; }
.summary-list li {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.65rem 0;
  border-bottom: 1px dashed #D8C7A6;
}
.summary-list li:last-child { border-bottom: 0; }
.summary-list span { opacity: 0.75; }
.summary-list strong { text-align: right; overflow-wrap: anywhere; }
.summary-list .total strong { color: var(--terracotta); }

.deadline { margin: 0; font-size: 0.88rem; opacity: 0.8; }
.confirm {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border: 1.5px solid var(--error);
  border-radius: var(--radius);
  background: #fff8f8;
}
.confirm h3 { margin: 0; }
.confirm p { margin: 0; }

@media (max-width: 480px) {
  .slip { padding-inline: 1rem; }
  .ref-code { font-size: 1.5rem; }
}
</style>
