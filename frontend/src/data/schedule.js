// SAMPLE hours - change these and every page (hours lists and reservation times) updates.
// days: 0 = Sunday ... 6 = Saturday. Times use 24-hour HH:MM.
export const schedule = [
  { label: 'Monday - Friday', days: [1, 2, 3, 4, 5], open: '10:00', close: '21:00' },
  { label: 'Saturday', days: [6], open: '09:00', close: '22:00' },
  { label: 'Sunday', days: [0], open: '09:00', close: '20:00' },
]

export const slotLengthMinutes = 30
export const lastSeatingBeforeCloseMinutes = 60

// Largest party that can be booked on the reservations page. Bigger groups are sent to the contact page.
export const maxOnlineGuests = 12

// A table must be booked at least this many hours ahead. Guests can change or cancel online until this many hours
// before the reservation; after that they call the restaurant. The API enforces the same number (backend/src/config/restaurant.js).
export const cutoffHours = 2

// Limits for the optional pre-order on the reservations page (also enforced by the API).
export const preOrderLimits = { maxQuantityPerDish: 20, maxTotalQuantity: 60 }
