<script setup>
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { sendMessage } from '../api/contact'
import PageHeader from '../components/PageHeader.vue'
import imgLatte from '../assets/picks/spanish-latte.webp'
import imgHalo from '../assets/picks/halo-halo.webp'
import HoursList from '../components/HoursList.vue'
import SuccessMark from '../components/SuccessMark.vue'
import { restaurantInfo } from '../data/restaurantInfo'
import { cutoffHours, slotLengthMinutes, lastSeatingBeforeCloseMinutes, maxOnlineGuests } from '../data/schedule'
import { describeMinutes } from '../utils/hours'

const route = useRoute()
const socialLinks = restaurantInfo.socialLinks.filter((link) => link.url)

// value is what gets saved (and later sent to the database); label is what guests see
const topicOptions = [
  { value: 'question', label: 'General question' },
  { value: 'reservation', label: 'About a reservation' },
  { value: 'group', label: `Large group booking (${maxOnlineGuests + 1}+ guests)` },
  { value: 'feedback', label: 'Feedback (puna o papuri)' },
  { value: 'other', label: 'Something else' },
]

function topicFromRoute() {
  const topic = route.query.topic
  return topicOptions.some((option) => option.value === topic) ? topic : ''
}

function topicLabel(value) {
  return topicOptions.find((option) => option.value === value)?.label || ''
}

function emptyForm() {
  return { name: '', email: '', topic: topicFromRoute(), message: '', website: '' }
}

const form = reactive(emptyForm())
const errors = reactive({})
const submitted = ref(false)
const submittedName = ref('')
const submittedTopic = ref('')
const sending = ref(false)
const serverError = ref('')

// e.g. arriving from the "large group" link on the reservations page
watch(() => route.query.topic, () => {
  const topic = topicFromRoute()
  if (topic) form.topic = topic
})

const faqs = [
  {
    question: 'How do I reserve a table?',
    answer: `Open the Reservations page, pick a date and a time, and tell us how many are coming. Times are offered every ${describeMinutes(slotLengthMinutes)}, up to ${describeMinutes(lastSeatingBeforeCloseMinutes)} before closing.`,
  },
  {
    question: 'How many guests can I book online?',
    answer: `Online bookings are for 1 to ${maxOnlineGuests} guests. For ${maxOnlineGuests + 1} or more, send us a message here and choose "Large group booking".`,
  },
  {
    question: 'Can I share special requests?',
    answer: 'Yes. Birthdays, high chairs and food allergies can go in the special requests box when you reserve.',
  },
  {
    question: 'Is my reservation confirmed once I submit?',
    answer: 'Yes. Your table is confirmed right away and you get a reference code. Keep it: with your email, it lets you view, change or cancel the booking on the Reservations page.',
  },
  {
    question: 'How do I cancel or change a reservation?',
    answer: `Open the Reservations page and choose "My reservations". Bookings made on your device are listed there, or you can search with your reference code and email. Online changes are open until ${cutoffHours} hours before your table. After that, please call us.`,
  },
  {
    question: 'Can I pre-order my food?',
    answer: 'Yes. Step 4 of the reservation form lets you choose dishes from the menu ahead of time. They are paid for at the restaurant, and you can change the pre-order along with the reservation.',
  },
  {
    question: 'Are the menu prices in pesos?',
    answer: 'Yes, every price on the menu is in Philippine pesos (₱).',
  },
]

function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!form.name.trim()) {
    errors.name = 'Enter your name.'
  }

  if (!form.email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address, like name@example.com.'
  }

  if (!form.topic) {
    errors.topic = 'Choose what your message is about.'
  }

  if (!form.message.trim()) {
    errors.message = 'Write a message.'
  } else if (form.message.trim().length < 10) {
    errors.message = 'Your message must be at least 10 characters.'
  }

  return Object.keys(errors).length === 0
}

async function submitForm() {
  serverError.value = ''
  if (!validate()) {
    document.querySelector('[aria-invalid="true"]')?.focus()
    return
  }

  sending.value = true
  try {
    await sendMessage({
      name: form.name.trim(),
      email: form.email.trim(),
      topic: form.topic,
      message: form.message.trim(),
      website: form.website, // hidden field; only bots fill it in
    })
    submittedName.value = form.name.trim()
    submittedTopic.value = form.topic
    submitted.value = true
  } catch (error) {
    if (error.details && typeof error.details === 'object') {
      Object.entries(error.details).forEach(([field, message]) => {
        if (['name', 'email', 'topic', 'message'].includes(field)) errors[field] = message
      })
    }
    serverError.value = error.message
  } finally {
    sending.value = false
  }
}

function writeAnother() {
  Object.assign(form, emptyForm())
  Object.keys(errors).forEach((key) => delete errors[key])
  submitted.value = false
}
</script>

<template>
  <div class="page">
    <PageHeader
      eyebrow="Makipag-ugnayan"
      title="Kumusta! Get in touch"
      accent="Get in touch"
      text="Questions, feedback or special requests? Fill in the form or use the details on this page."
      art="rolls"
      tone="gold"
      :image="imgLatte"
      :image2="imgHalo"
    />

    <section class="section">
      <div class="container contact-layout">
        <div class="card form-card ornate">
          <div v-if="submitted" class="confirmation" role="status">
            <SuccessMark />
            <p class="kicker">Salamat!</p>
            <h2>Message sent</h2>
            <p class="notice notice--success">
              Thank you, {{ submittedName }}. We received your message about
              "{{ topicLabel(submittedTopic) }}" and will reply to the email address you gave us.
            </p>
            <button type="button" class="btn" @click="writeAnother">Write another message</button>
          </div>

          <form v-else class="form" novalidate @submit.prevent="submitForm">
            <p v-if="serverError" class="notice notice--error" role="alert">{{ serverError }}</p>

            <!-- Hidden from people; spam bots tend to fill it in, and then the message is ignored. -->
            <div class="hp-field" aria-hidden="true">
              <label for="contact-website">Leave this field empty</label>
              <input id="contact-website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
            </div>

            <div class="form-row">
              <div class="field" :class="{ 'has-error': errors.name }">
                <label for="contact-name">Name</label>
                <input id="contact-name" v-model="form.name" type="text" autocomplete="name"
                  :aria-invalid="!!errors.name" :aria-describedby="errors.name ? 'contact-name-error' : undefined" />
                <p v-if="errors.name" id="contact-name-error" class="error-text">{{ errors.name }}</p>
              </div>
              <div class="field" :class="{ 'has-error': errors.email }">
                <label for="contact-email">Email address</label>
                <input id="contact-email" v-model="form.email" type="email" autocomplete="email"
                  :aria-invalid="!!errors.email" :aria-describedby="errors.email ? 'contact-email-error' : undefined" />
                <p v-if="errors.email" id="contact-email-error" class="error-text">{{ errors.email }}</p>
              </div>
            </div>

            <div class="field" :class="{ 'has-error': errors.topic }">
              <label for="contact-topic">What is it about?</label>
              <select id="contact-topic" v-model="form.topic"
                :aria-invalid="!!errors.topic" :aria-describedby="errors.topic ? 'contact-topic-error' : undefined">
                <option value="" disabled>Choose a topic</option>
                <option v-for="option in topicOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
              <p v-if="errors.topic" id="contact-topic-error" class="error-text">{{ errors.topic }}</p>
            </div>

            <div class="field" :class="{ 'has-error': errors.message }">
              <label for="contact-message">Message</label>
              <textarea id="contact-message" v-model="form.message" rows="5"
                :aria-invalid="!!errors.message" :aria-describedby="errors.message ? 'contact-message-error' : undefined"></textarea>
              <p v-if="errors.message" id="contact-message-error" class="error-text">{{ errors.message }}</p>
            </div>

            <div class="btn-row">
              <button type="submit" class="btn" :disabled="sending">{{ sending ? 'Sending...' : 'Send message' }}</button>
            </div>
          </form>
        </div>

        <aside class="card side-card ornate">
          <p class="kicker">Hanapin Kami</p>
          <h2>Restaurant details</h2>
          <address class="address">
            <p class="detail">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor" /></svg>
              <span><strong>Address</strong><br />{{ restaurantInfo.address }}</span>
            </p>
            <p class="detail">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor" /></svg>
              <span><strong>Phone</strong><br /><a :href="`tel:${restaurantInfo.phone.replace(/\s/g, '')}`">{{ restaurantInfo.phone }}</a></span>
            </p>
            <p class="detail">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.5 2.2V8l7.5 5 7.5-5v-.8L12 12.2 4.5 7.2z" fill="currentColor" /></svg>
              <span><strong>Email</strong><br /><a :href="`mailto:${restaurantInfo.email}`">{{ restaurantInfo.email }}</a></span>
            </p>
          </address>
          <p class="sample-note">Sample details. Replace before launch.</p>

          <h3>Opening hours</h3>
          <HoursList />

          <h3>Explore</h3>
          <ul class="link-list">
            <li><RouterLink to="/menu">Our menu</RouterLink></li>
            <li><RouterLink to="/reservations">Reservations</RouterLink></li>
            <li><RouterLink to="/about">About us</RouterLink></li>
            <li v-for="link in socialLinks" :key="link.label">
              <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
            </li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="section section--beige">
      <div class="container faq-layout">
        <div class="section-heading" v-reveal>
          <p class="kicker">Mga Madalas Itanong</p>
          <h2>Quick answers</h2>
          <p>The things guests ask us most. Can't find yours? Send us a message above.</p>
        </div>
        <div class="faq-list" v-reveal="{ delay: 100 }">
          <details v-for="item in faqs" :key="item.question" class="faq-item">
            <summary>{{ item.question }}</summary>
            <p>{{ item.answer }}</p>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hp-field { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
.contact-layout {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1.5fr 1fr;
  align-items: start;
}
.form-card,
.side-card { padding: 2.75rem 2.25rem 2.25rem; }
.side-card h2 { font-size: 1.5rem; }
.side-card h3 { margin-top: 1.75rem; }
.address { font-style: normal; }
.detail {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  margin-bottom: 0.9rem;
}
.detail svg {
  flex: none;
  width: 2rem;
  height: 2rem;
  padding: 0.45rem;
  border-radius: 50%;
  background: var(--gold-soft);
  color: var(--terracotta);
}
.sample-note { font-size: 0.82rem; opacity: 0.75; }
.confirmation { animation: pop 0.5s var(--ease); }
.link-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.4rem; }

/* FAQ */
.faq-layout {
  display: grid;
  gap: 3rem;
  grid-template-columns: 1fr 1.4fr;
  align-items: start;
}
.faq-layout .section-heading { margin-bottom: 0; }
.faq-list { display: grid; gap: 0.75rem; }
.faq-item {
  background: var(--white);
  border: var(--border);
  border-radius: var(--radius);
  transition: box-shadow 0.25s;
}
.faq-item[open] { box-shadow: var(--shadow-sm); border-color: var(--gold); }
.faq-item summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item summary::after {
  content: '+';
  flex: none;
  display: grid;
  place-items: center;
  width: 1.7rem;
  height: 1.7rem;
  font-size: 1.2rem;
  line-height: 1;
  border-radius: 50%;
  background: var(--gold-soft);
  color: var(--terracotta-dark);
  transition: transform 0.25s var(--ease);
}
.faq-item[open] summary::after { content: '\2212'; }
.faq-item p { margin: 0; padding: 0 1.25rem 1.1rem; font-size: 0.95rem; }

@media (max-width: 900px) {
  .contact-layout,
  .faq-layout { grid-template-columns: 1fr; }
  .faq-layout { gap: 1.5rem; }
}
@media (max-width: 480px) {
  .form-card,
  .side-card { padding: 2rem 1.25rem 1.25rem; }
}
</style>
