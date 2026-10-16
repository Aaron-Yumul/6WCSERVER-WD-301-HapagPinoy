import { ContactMessage } from '../models/ContactMessage.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { parseContactMessage } from '../validators/contact.js'

export const send = asyncHandler(async (req, res) => {
  const { value, errors, isSpam } = parseContactMessage(req.body)

  if (isSpam) return res.status(201).json({ data: { received: true }, message: 'Salamat! Your message was sent.' })

  if (Object.keys(errors).length) {
    throw new ApiError(422, 'Please check the highlighted fields.', { code: 'VALIDATION_ERROR', details: errors })
  }

  await ContactMessage.create(value)
  res.status(201).json({ data: { received: true }, message: 'Salamat! Your message was sent. We will reply by email.' })
})
