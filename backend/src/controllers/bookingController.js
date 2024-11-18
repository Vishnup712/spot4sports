const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { turfId, date, startTime, endTime } = req.body

    // Check if turf exists
    const turf = await prisma.turf.findUnique({
      where: { id: turfId },
    })

    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' })
    }

    // Check for booking conflicts
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        turfId,
        date: new Date(date),
        OR: [
          {
            AND: [{ startTime: { lte: new Date(startTime) } }, { endTime: { gt: new Date(startTime) } }],
          },
          {
            AND: [{ startTime: { lt: new Date(endTime) } }, { endTime: { gte: new Date(endTime) } }],
          },
        ],
      },
    })

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Time slot already booked' })
    }

    const booking = await prisma.booking.create({
      data: {
        turfId,
        userId: req.user.id,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
      include: {
        turf: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    res.status(201).json(booking)
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking' })
  }
}

// Get user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        turf: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' })
  }
}

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { turf: true },
    })

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Only turf owner can update booking status
    if (booking.turf.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        turf: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    res.json(updatedBooking)
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking' })
  }
}

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
    })

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    })

    res.json(updatedBooking)
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' })
  }
}
