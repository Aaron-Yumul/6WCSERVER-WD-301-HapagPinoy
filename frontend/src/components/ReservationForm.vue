<script setup>
import { computed, reactive, ref, watch } from 'vue'
import PreOrderPicker from './PreOrderPicker.vue'
import { createReservation, fetchAvailability, updateReservation } from '../api/reservations'
import { useMenu } from '../stores/menu'
import { cutoffHours, maxOnlineGuests } from '../data/schedule'
import { formatTime, toDateString } from '../utils/hours'

// reservation = null  -> booking a new table
// reservation = {...} -> editing that booking (auth is { token } or { email } so the API accepts the change)
const props = defineProps({
  reservation: { type: Object, default: null },
  auth: { type: Object, default: null },
})
const emit = defineEmits(['saved', 'cancel'])

const editing = computed(() => Boolean(props.reservation))
const today = toDateString(new Date())
const guestOptions = Array.from({ length: maxOnlineGuests }, (_, index) => index + 1)

// value is what gets saved; label is what guests see
const occasionOptions = [
  { value: 'birthday', label: 'Birthday (Kaarawan)' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'family', label: 'Family gathering (Salu-salo)' },
  { value: 'barkada', label: 'Barkada get-together' },
  { value: 'business', label: 'Business meal' },
  { value: 'other', label: 'Other celebration' },
]

const existing = props.reservation
const form = reactive({
  name: existing?.name || '',
  email: existing?.email || '',
  phone: existing?.phone || '',
  date: existing?.date || '',
  time: existing?.time || '',
  guests: existing ? String(existing.guests) : '',
  occasion: existing?.occasion || '',
  requests: existing?.requests || '',
})
const preOrder = ref(Object.fromEntries((existing?.preOrder?.items || []).map((item) => [item.itemId, item.quantity])))
const errors = reactive({})
const serverError = ref('')
const submitting = ref(false)
const preOrderNotice = ref('')

// ----- Dishes removed from the menu since the booking was made are dropped from the pre-order -----
const { items: menuItems, menu } = useMenu()
watch(
  () => menu.status,
  (status) => {
    if (status !== 'ready' || !editing.value) return
    const known = new Set(menuItems.value.map((item) => item.id))
    const kept = Object.entries(preOrder.value).filter(([id]) => known.has(id))
    if (kept.length !== Object.keys(preOrder.value).length) {
      preOrder.value = Object.fromEntries(kept)
      preOrderNotice.value = 'Some dishes in your earlier pre-order are no longer on the menu, so they were removed. Save to confirm.'
    }
  },
  { immediate: true },
)

// ----- Time slots come from the API so full times are not offered -----
const slots = ref([])
const slotsStatus = ref('idle') // idle | loading | ready | error
const slotsError = ref('')
const closedThatDay = ref(false)
let slotRequest = 0

async function loadSlots() {
  slots.value = []
  slotsError.value = ''
  closedThatDay.value = false
  if (!form.date || form.date < today) {
    slotsStatus.value = 'idle'
    return
  }
  const requestId = (slotRequest += 1)
  slotsStatus.value = 'loading'
  try {
    const data = await fetchAvailability(form.date, props.reservation?.reference)
    if (requestId !== slotRequest) return // the guest already picked another date
    slots.value = data.slots
    closedThatDay.value = !data.open
    slotsStatus.value = 'ready'
    if (form.time && !data.slots.some((slot) => slot.time === form.time && slot.available)) form.time = ''
  } catch (error) {
    if (requestId !== slotRequest) return
    slotsStatus.value = 'error'
    slotsError.value = error.details?.date || error.message
    form.time = ''
  }
}
watch(() => form.date, loadSlots, { immediate: true })

const guestCount = computed(() => Math.max(1, Number(form.guests) || 1))
const timeOptions = computed(() =>
  slots.value.map((slot) => {
    const enough = slot.seatsLeft >= guestCount.value
    let note = ''
    if (!slot.available) note = ' (fully booked)'
    else if (!enough) note = ` (only ${slot.seatsLeft} seats left)`
    else if (slot.seatsLeft <= 8) note = ` (${slot.seatsLeft} seats left)`
    return { time: slot.time, disabled: !slot.available || !enough, label: `${formatTime(slot.time)}${note}` }
  }),
)

// ----- Checking the form before it is sent (the API checks everything again) -----
function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!form.name.trim()) errors.name = 'Enter your name.'
  else if (form.name.trim().length < 2) errors.name = 'Your name must be at least 2 characters.'

  if (!editing.value) {
    if (!form.email.trim()) errors.email = 'Enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'Enter a valid email address, like name@example.com.'
  }

  const phoneDigits = form.phone.replace(/[\s\-().]/g, '')
  if (!form.phone.trim()) errors.phone = 'Enter your phone number.'
  else if (!/^\+?\d{10,13}$/.test(phoneDigits)) errors.phone = 'Enter a valid phone number, like 09123456789 or +639123456789.'

  if (!form.date) errors.date = 'Choose a reservation date.'
  else if (form.date < today) errors.date = 'Choose today or a future date.'

  if (!form.date || errors.date) {
    errors.time = 'Choose a date first, then pick a time.'
  } else if (slotsStatus.value === 'loading') {
    errors.time = 'Still checking the available times. Try again in a moment.'
  } else if (slotsStatus.value === 'error') {
    errors.time = slotsError.value || 'We could not load the available times.'
  } else if (!timeOptions.value.length) {
    errors.time = 'No reservation times are left on this date. Choose another day.'
  } else if (!form.time) {
    errors.time = 'Choose a reservation time.'
  } else if (timeOptions.value.find((option) => option.time === form.time)?.disabled) {
    errors.time = 'That time does not have enough seats for your group. Choose another time.'
  }

  if (!form.guests) errors.guests = 'Select the number of guests.'

  return Object.keys(errors).length === 0
}

const FIELDS = ['name', 'email', 'phone', 'date', 'time', 'guests', 'occasion', 'requests', 'preOrder']

function showServerError(error) {
  if (error.details && typeof error.details === 'object') {
    FIELDS.forEach((field) => {
      if (error.details[field]) errors[field] = error.details[field]
    })
  }
  serverError.value = error.message
  // The slot may have been taken while the form was open, so show fresh availability.
  if (error.code === 'SLOT_FULL') loadSlots()
}

async function submit() {
  serverError.value = ''
  if (!validate()) {
    document.querySelector('[aria-invalid="true"]')?.focus()
    return
  }

  const payload = {
    name: form.name.trim(),
    phone: form.phone.trim(),
    date: form.date,
    time: form.time,
    guests: Number(form.guests),
    occasion: form.occasion,
    requests: form.requests.trim(),
    preOrder: Object.entries(preOrder.value)
      .filter(([, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity })),
  }

  submitting.value = true
  try {
    if (editing.value) {
      const saved = await updateReservation(props.reservation.reference, payload, props.auth || {})
      emit('saved', { reservation: saved })
    } else {
      const created = await createReservation({ ...payload, email: form.email.trim() })
      emit('saved', { reservation: created, manageToken: created.manageToken })
    }
  } catch (error) {
    showServerError(error)
    document.querySelector('.form-alert')?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  Object.assign(form, { name: '', email: '', phone: '', date: '', time: '', guests: '', occasion: '', requests: '' })
  preOrder.value = {}
  Object.keys(errors).forEach((key) => delete errors[key])
  serverError.value = ''
}
</script>

<template>
  <form class="form" novalidate @submit.prevent="submit">
    <p v-if="editing" class="notice notice--info">
      Changing reservation <strong>{{ reservation.reference }}</strong>. You can edit it online until {{ cutoffHours }} hours before your table.
    </p>
    <p v-else class="notice notice--info">
      Your table is confirmed right away, and you can change or cancel it online until {{ cutoffHours }} hours before.
    </p>

    <p v-if="serverError" class="notice notice--error form-alert" role="alert">{{ serverError }}</p>

    <div class="step" role="group" aria-labelledby="step-when">
      <h3 id="step-when" class="step-title"><span class="step-no" aria-hidden="true">1</span>When <em>Kailan?</em></h3>
      <div class="form-row">
        <div class="field" :class="{ 'has-error': errors.date }">
          <label for="res-date">Reservation date</label>
          <input id="res-date" v-model="form.date" type="date" :min="today"
            :aria-invalid="!!errors.date" :aria-describedby="errors.date ? 'res-date-error' : undefined" />
          <p v-if="errors.date" id="res-date-error" class="error-text">{{ errors.date }}</p>
          <p v-else-if="closedThatDay" class="hint">We are closed on that day. Choose another date.</p>
        </div>
        <div class="field" :class="{ 'has-error': errors.time }">
          <label for="res-time">Reservation time</label>
          <select id="res-time" v-model="form.time" :disabled="!form.date || slotsStatus === 'loading'"
            :aria-invalid="!!errors.time" :aria-describedby="errors.time ? 'res-time-error' : undefined">
            <option value="" disabled>{{ !form.date ? 'Choose a date first' : slotsStatus === 'loading' ? 'Checking times...' : 'Select a time' }}</option>
            <option v-for="option in timeOptions" :key="option.time" :value="option.time" :disabled="option.disabled">{{ option.label }}</option>
          </select>
          <p v-if="errors.time" id="res-time-error" class="error-text">{{ errors.time }}</p>
          <p v-else-if="slotsStatus === 'ready' && !timeOptions.length && !closedThatDay" class="hint">No times left on this date. Choose another day.</p>
          <p v-else-if="slotsStatus === 'error'" class="hint">{{ slotsError }}</p>
        </div>
      </div>
    </div>

    <div class="step" role="group" aria-labelledby="step-who">
      <h3 id="step-who" class="step-title"><span class="step-no" aria-hidden="true">2</span>How many <em>Ilan kayo?</em></h3>
      <div class="form-row">
        <div class="field" :class="{ 'has-error': errors.guests }">
          <label for="res-guests">Number of guests</label>
          <select id="res-guests" v-model="form.guests"
            :aria-invalid="!!errors.guests" :aria-describedby="errors.guests ? 'res-guests-error' : undefined">
            <option value="" disabled>Select number of guests</option>
            <option v-for="count in guestOptions" :key="count" :value="String(count)">
              {{ count }} {{ count === 1 ? 'guest' : 'guests' }}
            </option>
          </select>
          <p v-if="errors.guests" id="res-guests-error" class="error-text">{{ errors.guests }}</p>
        </div>
        <div class="field" :class="{ 'has-error': errors.occasion }">
          <label for="res-occasion">Occasion <span class="optional">(optional)</span></label>
          <select id="res-occasion" v-model="form.occasion">
            <option value="">No special occasion</option>
            <option v-for="option in occasionOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
          <p v-if="errors.occasion" class="error-text">{{ errors.occasion }}</p>
        </div>
      </div>
    </div>

    <div class="step" role="group" aria-labelledby="step-details">
      <h3 id="step-details" class="step-title"><span class="step-no" aria-hidden="true">3</span>Your details <em>Sino kayo?</em></h3>

      <div class="field" :class="{ 'has-error': errors.name }">
        <label for="res-name">Full name</label>
        <input id="res-name" v-model="form.name" type="text" autocomplete="name" maxlength="80"
          :aria-invalid="!!errors.name" :aria-describedby="errors.name ? 'res-name-error' : undefined" />
        <p v-if="errors.name" id="res-name-error" class="error-text">{{ errors.name }}</p>
      </div>

      <div class="form-row">
        <div class="field" :class="{ 'has-error': errors.email }">
          <label for="res-email">Email address</label>
          <input id="res-email" v-model="form.email" type="email" autocomplete="email" :disabled="editing" maxlength="120"
            :aria-invalid="!!errors.email" :aria-describedby="errors.email ? 'res-email-error' : 'res-email-hint'" />
          <p v-if="errors.email" id="res-email-error" class="error-text">{{ errors.email }}</p>
          <p v-else id="res-email-hint" class="hint">
            {{ editing ? 'The email cannot be changed. To use another one, cancel this booking and make a new one.' : 'You will need it, with your reference code, to find this booking again.' }}
          </p>
        </div>
        <div class="field" :class="{ 'has-error': errors.phone }">
          <label for="res-phone">Phone number</label>
          <input id="res-phone" v-model="form.phone" type="tel" autocomplete="tel" placeholder="09123456789"
            :aria-invalid="!!errors.phone" :aria-describedby="errors.phone ? 'res-phone-error' : undefined" />
          <p v-if="errors.phone" id="res-phone-error" class="error-text">{{ errors.phone }}</p>
        </div>
      </div>

      <div class="field" :class="{ 'has-error': errors.requests }">
        <label for="res-requests">Special requests <span class="optional">(optional)</span></label>
        <textarea id="res-requests" v-model="form.requests" maxlength="300"
          placeholder="High chair, food allergies, a surprise for the celebrant..."></textarea>
        <p v-if="errors.requests" class="error-text">{{ errors.requests }}</p>
      </div>
    </div>

    <div class="step" role="group" aria-labelledby="step-preorder">
      <h3 id="step-preorder" class="step-title"><span class="step-no" aria-hidden="true">4</span>Pre-order <em>Handa na ang hapag</em> <span class="optional">(optional)</span></h3>
      <p v-if="preOrderNotice" class="notice notice--warning" role="status">{{ preOrderNotice }}</p>
      <PreOrderPicker v-model="preOrder" />
      <p v-if="errors.preOrder" class="error-text">{{ errors.preOrder }}</p>
    </div>

    <div class="btn-row">
      <button type="submit" class="btn" :disabled="submitting">
        {{ submitting ? 'Saving...' : editing ? 'Save changes' : 'Submit reservation' }}
      </button>
      <button v-if="editing" type="button" class="btn btn--outline" :disabled="submitting" @click="emit('cancel')">Keep original</button>
      <button v-else type="button" class="btn btn--outline" :disabled="submitting" @click="resetForm">Reset form</button>
    </div>
  </form>
</template>

<style scoped>
.step { display: grid; gap: 1.2rem; }
.step + .step {
  padding-top: 1.5rem;
  border-top: 1px dashed #D8C7A6;
}
.step-title {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.15rem 0.5rem;
  margin: 0;
  font-size: 1.25rem;
}
.step-no {
  align-self: center;
  display: inline-grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  margin-right: 0.25rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 50%;
  background: var(--gold);
  color: var(--brown);
}
.step-title em {
  font-size: 0.95rem;
  font-weight: 400;
  color: var(--terracotta);
}
.step-title .optional { font-family: var(--font-body); font-size: 0.85rem; font-weight: 400; opacity: 0.7; }
.field input:disabled { opacity: 0.7; cursor: not-allowed; background: var(--cream); }
</style>
