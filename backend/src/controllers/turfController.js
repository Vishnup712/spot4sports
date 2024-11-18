const { PrismaClient } = require('@prisma/client')
const { cloudinary } = require('../config/cloudinary')
const prisma = new PrismaClient()

// Create a new turf
exports.createTurf = async (req, res) => {
  try {
    const { name, location, price, description, openTime, closeTime, slotDuration, facilities } = req.body

    // Validate required fields
    if (!name || !location || !price || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' })
    }

    // Handle image URLs from uploaded files
    const images = req.files ? req.files.map((file) => file.path) : []

    // Handle facilities - check if it's a string and needs parsing
    let parsedFacilities = []
    if (facilities) {
      try {
        parsedFacilities = typeof facilities === 'string' ? JSON.parse(facilities) : facilities
      } catch (e) {
        // If parsing fails, treat it as a single facility
        parsedFacilities = [facilities]
      }
    }

    // Create turf with owner relationship
    const turf = await prisma.turf.create({
      data: {
        name,
        location,
        price: parseFloat(price),
        description,
        openTime,
        closeTime,
        slotDuration: slotDuration ? parseInt(slotDuration) : null,
        facilities: parsedFacilities,
        images,
        owner: {
          connect: { id: req.user.id },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    res.status(201).json(turf)
  } catch (error) {
    console.error('Error creating turf:', error)
    res.status(500).json({
      message: 'Error creating turf',
      error: error.message,
    })
  }
}

// Get all turfs
exports.getTurfs = async (req, res) => {
  try {
    const turfs = await prisma.turf.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
    res.json(turfs)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching turfs' })
  }
}

// Get single turf
exports.getTurf = async (req, res) => {
  try {
    const turf = await prisma.turf.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' })
    }
    res.json(turf)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching turf' })
  }
}

// Update turf
exports.updateTurf = async (req, res) => {
  try {
    const turf = await prisma.turf.findUnique({
      where: { id: req.params.id },
    })

    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' })
    }

    if (turf.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    // Parse the existing images from the request
    let images = []
    if (req.body.existingImages) {
      images = JSON.parse(req.body.existingImages)
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path)
      images = [...images, ...newImages]
    }

    // Parse other fields
    const updateData = {
      name: req.body.name,
      location: req.body.location,
      price: parseFloat(req.body.price),
      description: req.body.description,
      slotDuration: req.body.slotDuration ? parseInt(req.body.slotDuration) : null,
      openTime: req.body.openTime || null,
      closeTime: req.body.closeTime || null,
      facilities: req.body.facilities ? JSON.parse(req.body.facilities) : [],
      images: images,
    }

    const updatedTurf = await prisma.turf.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    res.json(updatedTurf)
  } catch (error) {
    console.error('Error updating turf:', error)
    res.status(500).json({
      message: 'Error updating turf',
      error: error.message,
    })
  }
}

// Delete turf
exports.deleteTurf = async (req, res) => {
  try {
    const turf = await prisma.turf.findUnique({
      where: { id: req.params.id },
    })

    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' })
    }

    // Allow deletion if user is the owner
    if (turf.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await prisma.turf.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Turf deleted successfully' })
  } catch (error) {
    console.error('Error deleting turf:', error)
    res.status(500).json({ message: 'Error deleting turf' })
  }
}
