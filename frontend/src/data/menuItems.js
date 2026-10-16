// The dishes themselves now live in MongoDB and come from the API (see src/stores/menu.js).
// This file keeps what is purely visual: each category's illustration (art) and tile colour,
// used until the API answers and for categories the database does not style.
// A dish from the API can carry `tone` (illustration colour), `art` (illustration type) and `origin`.

export const categories = [
  { name: 'Appetizers', local: 'Pampagana', art: 'appetizer', tile: 'clay', blurb: 'Crispy, savory starters made for sharing.' },
  { name: 'Pasta and Noodles', local: 'Pancit at Pasta', art: 'pasta', tile: 'sand', blurb: 'Pancit and Filipino-style pasta, served by the plate.' },
  { name: 'Rice Meals', local: 'Kanin at Ulam', art: 'rice', tile: 'paper', blurb: 'Hearty plates, each served with rice and a classic side.' },
  { name: 'Main Courses', local: 'Lutong Bahay', art: 'bowl', artTone: '#D08A3C', tile: 'clay', blurb: 'Stews, soups and hearty favorites from across the islands.' },
  { name: 'Breads', local: 'Tinapay', art: 'bread', tile: 'sand', blurb: 'Baked fresh and served warm, from pandesal to ensaymada.' },
  { name: 'Desserts', local: 'Panghimagas', art: 'dessert', tile: 'paper', blurb: 'Sweet Filipino classics to finish the meal.' },
  { name: 'Hot Coffee', local: 'Kape', art: 'coffee', tile: 'cocoa', blurb: 'Barako and espresso drinks, served hot.' },
  { name: 'Iced Coffee', local: 'Malamig na Kape', art: 'beverage', artTone: 'mocha', tile: 'sand', blurb: 'Espresso drinks poured over ice.' },
  { name: 'Beverages', local: 'Inumin', art: 'beverage', tile: 'clay', blurb: 'Shakes, juices and Filipino coolers.' },
]

export const categoryNames = categories.map((category) => category.name)

export function getArtForItem(item) {
  if (item.art) return item.art
  const category = categories.find((entry) => entry.name === item.category)
  return category ? category.art : 'main'
}

export function getTileForCategory(categoryName) {
  const category = categories.find((entry) => entry.name === categoryName)
  return category ? category.tile : 'sand'
}

export function formatPeso(amount) {
  return `₱${amount.toLocaleString('en-PH')}`
}
