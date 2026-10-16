// Real dish photos (transparent WebP cut-outs) keyed by menu item slug.
// Used by the menu cards and the dish details dialog.
//
// Only photos that truly show the dish are mapped here. A dish without a photo
// shows its DishArt illustration until one is added.
//
// To add a photo: drop a transparent WebP named after the dish slug into
// src/assets/dishes/ (for example bicol-express.webp). It is picked up
// automatically and wins over the mapping below.
import canton from '../assets/picks/pancit-canton.webp'
import sisig from '../assets/picks/pork-sisig.webp'
import bulalo from '../assets/picks/bulalo.webp'
import ube from '../assets/picks/ube-pandesal.webp'
import halo from '../assets/picks/halo-halo.webp'
import latte from '../assets/picks/spanish-latte.webp'

import lumpia from '../assets/tiles/appetizers.webp'
import palabok from '../assets/tiles/pasta.webp'
import kareKare from '../assets/tiles/maincourse.webp'
import turon from '../assets/tiles/desserts.webp'
import barako from '../assets/tiles/hotcoffee.webp'
import icedLatte from '../assets/tiles/icedcoffee.webp'

import adobo from '../assets/hero/adobo.webp'
import lecheFlan from '../assets/hero/lecheflan.webp'
import tsokolate from '../assets/hero/tsokolate.webp'

const bundled = {
  // Appetizers
  'lumpiang-shanghai': lumpia,
  // Pasta and Noodles
  'pancit-canton': canton,
  'pancit-palabok': palabok,
  // Rice Meals
  'chicken-adobo-rice-meal': adobo,
  'pork-sisig-rice-meal': sisig,
  // Main Courses
  'kare-kare': kareKare,
  bulalo,
  // Breads
  'ube-cheese-pandesal': ube,
  // Desserts
  'halo-halo': halo,
  'leche-flan': lecheFlan,
  turon,
  // Hot Coffee
  'kapeng-barako': barako,
  'cafe-latte': latte,
  'spanish-latte': latte,
  // Iced Coffee
  'iced-spanish-latte': icedLatte,
  // Beverages
  tsokolate,
}

// Photos dropped into src/assets/dishes/<slug>.(webp|png|jpg)
const dropIns = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/dishes/*.{webp,png,jpg,jpeg}', { eager: true, import: 'default' }))
    .map(([path, url]) => [path.split('/').pop().replace(/\.[^.]+$/, ''), url]),
)

export const dishPhotos = { ...bundled, ...dropIns }

export function getDishPhoto(slug) {
  return dishPhotos[slug] || ''
}
