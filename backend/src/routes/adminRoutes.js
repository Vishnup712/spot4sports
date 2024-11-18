const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const adminProtect = require('../middleware/adminAuth')
const { getDashboardStats, getAllUsers, updateUserRole, getAllTurfs, getAllBookings, getCommunityStats } = require('../controllers/adminController')

// All routes are protected and require admin access
router.use(protect)
router.use(adminProtect)

// Dashboard routes
router.get('/dashboard-stats', getDashboardStats)

// User management routes
router.get('/users', getAllUsers)
router.put('/users/:id/role', updateUserRole)

// Turf management routes
router.get('/turfs', getAllTurfs)

// Booking management routes
router.get('/bookings', getAllBookings)

// Community management routes
router.get('/community-stats', getCommunityStats)

module.exports = router
