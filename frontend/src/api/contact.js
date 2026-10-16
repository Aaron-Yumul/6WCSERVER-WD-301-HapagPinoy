import { request } from './client'

export async function sendMessage(payload) {
  return (await request('/contact', { method: 'POST', body: payload })).data
}
