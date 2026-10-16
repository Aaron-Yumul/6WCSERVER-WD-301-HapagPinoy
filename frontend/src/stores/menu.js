// The menu is loaded from the API once and shared by every page.
import { computed, reactive } from 'vue'
import { fetchMenu } from '../api/menu'
import { categories as categoryStyles } from '../data/menuItems'

const state = reactive({
  items: [],
  categories: categoryStyles, // until the API answers, the built-in category list is shown
  status: 'idle', // idle | loading | ready | error
  error: '',
})

let pending = null

export function loadMenu({ force = false } = {}) {
  if (pending && !force) return pending
  if (state.status === 'ready' && !force) return Promise.resolve()

  state.status = 'loading'
  state.error = ''
  pending = fetchMenu()
    .then(({ items, categories }) => {
      state.items = items
      if (categories.length) {
        // Names, Filipino names and blurbs come from the database; art and tile styles stay in the frontend.
        state.categories = categories.map((category) => ({
          ...(categoryStyles.find((style) => style.name === category.name) || { art: 'main', tile: 'sand' }),
          ...category,
        }))
      }
      state.status = 'ready'
    })
    .catch((error) => {
      state.status = 'error'
      state.error = error.message
    })
    .finally(() => {
      pending = null
    })
  return pending
}

export function useMenu() {
  loadMenu()
  return {
    menu: state,
    items: computed(() => state.items),
    categories: computed(() => state.categories),
    isLoading: computed(() => state.status === 'idle' || state.status === 'loading'),
    hasError: computed(() => state.status === 'error'),
    retry: () => loadMenu({ force: true }),
  }
}
