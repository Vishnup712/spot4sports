const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const authRoutes = require('./routes/authRoutes')
const turfRoutes = require('./routes/turfRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const communityRoutes = require('./routes/communityRoutes')
const errorHandler = require('./middleware/errorHandler')
const adminRoutes = require('./routes/adminRoutes')

require('dotenv').config()

const prisma = new PrismaClient()
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/turfs', turfRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/admin', adminRoutes)

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
