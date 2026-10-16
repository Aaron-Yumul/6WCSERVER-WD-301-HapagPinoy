import { request } from './client'

export async function fetchMenu() {
  const [items, categories] = await Promise.all([request('/menu'), request('/menu/categories')])
  return { items: items.data, categories: categories.data }
}
