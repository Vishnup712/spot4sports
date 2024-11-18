const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const { createBooking, getMyBookings, updateBookingStatus, cancelBooking } = require('../controllers/bookingController')

router.use(protect) // All booking routes require authentication

router.route('/').get(getMyBookings).post(createBooking)

router.route('/:id/status').put(updateBookingStatus)

router.route('/:id/cancel').put(cancelBooking)

module.exports = router
