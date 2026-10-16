// Reservations made in this browser are remembered (reference code + secret token) so the guest can
// open, change or cancel them later without typing anything. The token never leaves the device except
// as a request header to our own API.
const KEY = 'hapagpinoy-my-reservations'
const MAX_SAVED = 10

export function loadSaved() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(list) ? list.filter((entry) => entry && entry.reference && entry.token) : []
  } catch {
    return []
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_SAVED)))
  } catch {
    // Private browsing or full storage: the guest can still use the reference code and email.
  }
}

export function saveReservation(reference, token) {
  write([{ reference, token }, ...loadSaved().filter((entry) => entry.reference !== reference)])
}

export function forgetReservation(reference) {
  write(loadSaved().filter((entry) => entry.reference !== reference))
}
