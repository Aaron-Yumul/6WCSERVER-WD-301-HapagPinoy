import { schedule, slotLengthMinutes, lastSeatingBeforeCloseMinutes } from '../data/schedule'


export function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function formatTime(time) {
  const totalMinutes = typeof time === 'number' ? time : toMinutes(time)
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 === 0 ? 12 : hours % 12
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${suffix}`
}

export function toDateString(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatLongDate(dateString) {
  return parseLocalDate(dateString).toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getEntryForDay(dayIndex) {
  return schedule.find((entry) => entry.days.includes(dayIndex))
}

export function scheduleRows() {
  return schedule.map((entry) => ({
    label: entry.label,
    days: entry.days,
    hours: `${formatTime(entry.open)} - ${formatTime(entry.close)}`,
  }))
}

export function getHoursForDate(dateString) {
  if (!dateString) return null
  const entry = getEntryForDay(parseLocalDate(dateString).getDay())
  if (!entry) return null
  return {
    open: formatTime(entry.open),
    close: formatTime(entry.close),
    lastSeating: formatTime(toMinutes(entry.close) - lastSeatingBeforeCloseMinutes),
  }
}

export function getTimeSlots(dateString, now = new Date()) {
  if (!dateString) return []
  const entry = getEntryForDay(parseLocalDate(dateString).getDay())
  if (!entry) return []

  const firstSlot = toMinutes(entry.open)
  const lastSlot = toMinutes(entry.close) - lastSeatingBeforeCloseMinutes
  const isToday = toDateString(now) === dateString
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const slots = []
  for (let minutes = firstSlot; minutes <= lastSlot; minutes += slotLengthMinutes) {
    if (isToday && minutes <= nowMinutes) continue
    slots.push(minutesToTime(minutes))
  }
  return slots
}

// 30 -> "30 minutes", 60 -> "1 hour", 90 -> "90 minutes"
export function describeMinutes(totalMinutes) {
  if (totalMinutes >= 60 && totalMinutes % 60 === 0) {
    const hours = totalMinutes / 60
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  }
  return `${totalMinutes} minutes`
}
