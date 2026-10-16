import { Router } from 'express'
import { availability, cancel, create, read, update } from '../controllers/reservations.js'
import { bookingLimiter, manageLimiter } from '../middleware/rateLimit.js'

const router = Router()

router.get('/availability', availability) 
router.post('/', bookingLimiter, create) 
router.get('/:reference', manageLimiter, read) 
router.patch('/:reference', manageLimiter, update) 
router.delete('/:reference', manageLimiter, cancel) 

export default router
