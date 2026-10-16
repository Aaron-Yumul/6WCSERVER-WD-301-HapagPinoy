import { request } from './client'

// The secret token (returned once when a table is booked) proves the booking belongs to this browser.
const tokenHeader = (token) => (token ? { 'x-manage-token': token } : {})

// Free seats for each time slot on a date. Pass `exclude` (a reference) while editing that booking.
export async function fetchAvailability(date, exclude) {
  return (await request('/reservations/availability', { query: { date, exclude } })).data
}

export async function createReservation(payload) {
  return (await request('/reservations', { method: 'POST', body: payload })).data
}

// Open a booking with its token, or with the reference code plus the email used to book.
export async function getReservation(reference, { token, email } = {}) {
  return (await request(`/reservations/${encodeURIComponent(reference)}`, { headers: tokenHeader(token), query: { email } })).data
}

export async function updateReservation(reference, changes, { token, email } = {}) {
  const body = token ? changes : { ...changes, email }
  return (await request(`/reservations/${encodeURIComponent(reference)}`, { method: 'PATCH', headers: tokenHeader(token), body })).data
}

export async function cancelReservation(reference, { token, email, reason } = {}) {
  return (
    await request(`/reservations/${encodeURIComponent(reference)}`, {
      method: 'DELETE',
      headers: tokenHeader(token),
      query: { email: token ? undefined : email },
      body: reason ? { reason } : undefined,
    })
  ).data
}
