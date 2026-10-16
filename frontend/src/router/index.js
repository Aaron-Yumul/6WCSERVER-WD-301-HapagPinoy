import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MenuView from '../views/MenuView.vue'
import ReservationsView from '../views/ReservationsView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'Home' } },
  { path: '/menu', name: 'menu', component: MenuView, meta: { title: 'Our Menu' } },
  { path: '/reservations', name: 'reservations', component: ReservationsView, meta: { title: 'Reservations' } },
  { path: '/about', name: 'about', component: AboutView, meta: { title: 'About Us' } },
  { path: '/contact', name: 'contact', component: ContactView, meta: { title: 'Contact' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title} | HapagPinoy`
})

export default router
