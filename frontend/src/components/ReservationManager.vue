<script setup>
import { ref } from 'vue'
import ReservationCard from './ReservationCard.vue'
import ReservationForm from './ReservationForm.vue'
import { saveReservation } from '../utils/myReservations'

// One booking, either as a card (view / cancel) or as the edit form.
const props = defineProps({
  reservation: { type: Object, required: true },
  auth: { type: Object, default: null },
  banner: { type: String, default: '' },
})
const emit = defineEmits(['changed'])

const current = ref(props.reservation)
const editing = ref(false)
const message = ref(props.banner)

function onChanged(updated) {
  current.value = updated
  message.value = ''
  emit('changed', updated)
}

function onSaved({ reservation }) {
  if (props.auth?.token) saveReservation(reservation.reference, props.auth.token)
  editing.value = false
  message.value = 'Your reservation was updated.'
  current.value = reservation
  emit('changed', reservation)
}
</script>

<template>
  <ReservationForm v-if="editing" :reservation="current" :auth="auth" @saved="onSaved" @cancel="editing = false" />
  <ReservationCard v-else :reservation="current" :auth="auth" :banner="message" @edit="editing = true" @changed="onChanged" />
</template>
