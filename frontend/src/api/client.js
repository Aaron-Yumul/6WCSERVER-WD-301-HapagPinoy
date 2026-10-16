// Small fetch wrapper used by every API call.
const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'ERROR', details = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details // { fieldName: 'message' } for form errors
  }
}

export async function request(path, { method = 'GET', body, headers = {}, query } = {}) {
  let url = `${BASE_URL}${path}`
  if (query) {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.set(key, value)
    })
    const queryString = params.toString()
    if (queryString) url += `?${queryString}`
  }

  let response
  try {
    response = await fetch(url, {
      method,
      headers: { Accept: 'application/json', ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('We could not reach the server. Check your internet connection and try again.', { code: 'NETWORK' })
  }

  let payload = null
  try {
    payload = await response.json()
  } catch {
    // Not JSON (for example a gateway error page); handled below.
  }

  if (!response.ok) {
    const error = payload?.error
    throw new ApiError(error?.message || 'Something went wrong. Please try again.', {
      status: response.status,
      code: error?.code || 'ERROR',
      details: error?.details || null,
    })
  }
  return payload
}
