const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [users, turfs, bookings, players, posts] = await Promise.all([prisma.user.count(), prisma.turf.count(), prisma.booking.count(), prisma.player.count(), prisma.post.count()])

    // Calculate total revenue
    const totalRevenue = await prisma.booking.aggregate({
      where: {
        status: 'CONFIRMED',
      },
      _sum: {
        totalPrice: true,
      },
    })

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        turf: {
          select: {
            name: true,
          },
        },
      },
    })

    res.json({
      stats: {
        totalUsers: users,
        totalTurfs: turfs,
        totalBookings: bookings,
        totalPlayers: players,
        totalPosts: posts,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
      },
      recentBookings,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats' })
  }
}

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        player: true,
        turfs: {
          select: {
            id: true,
            name: true,
          },
        },
        bookings: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' })
  }
}

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' })
  }
}

// Get all turfs with details
exports.getAllTurfs = async (req, res) => {
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
        bookings: {
          select: {
            id: true,
            status: true,
            totalPrice: true,
          },
        },
      },
    })

    // Add additional statistics for each turf
    const turfsWithStats = turfs.map((turf) => ({
      ...turf,
      totalBookings: turf.bookings.length,
      confirmedBookings: turf.bookings.filter((b) => b.status === 'CONFIRMED').length,
      revenue: turf.bookings.filter((b) => b.status === 'CONFIRMED').reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    }))

    res.json(turfsWithStats)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching turfs' })
  }
}

// Get all bookings with details
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        turf: {
          select: {
            id: true,
            name: true,
            location: true,
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' })
  }
}

// Get community statistics
exports.getCommunityStats = async (req, res) => {
  try {
    const [players, posts, comments, ratings] = await Promise.all([prisma.player.count(), prisma.post.count(), prisma.comment.count(), prisma.rating.count()])

    // Get recent posts
    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        player: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    res.json({
      stats: {
        totalPlayers: players,
        totalPosts: posts,
        totalComments: comments,
        totalRatings: ratings,
      },
      recentPosts,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching community stats' })
  }
}
