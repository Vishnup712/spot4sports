const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Player Profile Controllers
exports.createPlayerProfile = async (req, res) => {
  try {
    const { position, phoneNumber, location, skills, experience, bio } = req.body

    // Check if player profile already exists
    const existingProfile = await prisma.player.findUnique({
      where: { userId: req.user.id },
    })

    if (existingProfile) {
      return res.status(400).json({ message: 'Player profile already exists' })
    }

    const player = await prisma.player.create({
      data: {
        userId: req.user.id,
        position,
        phoneNumber,
        location,
        skills: skills || [],
        experience: experience ? parseInt(experience) : null,
        bio,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    res.status(201).json(player)
  } catch (error) {
    console.error('Error creating player profile:', error)
    res.status(500).json({ message: 'Error creating player profile' })
  }
}

exports.getPlayerProfile = async (req, res) => {
  try {
    const player = await prisma.player.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receivedRatings: {
          include: {
            fromPlayer: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!player) {
      return res.status(404).json({ message: 'Player not found' })
    }

    res.json(player)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching player profile' })
  }
}

exports.updatePlayerProfile = async (req, res) => {
  try {
    const { position, phoneNumber, location, skills, experience, bio, availability } = req.body

    const player = await prisma.player.findUnique({
      where: { id: req.params.id },
    })

    if (!player) {
      return res.status(404).json({ message: 'Player not found' })
    }

    if (player.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const updatedPlayer = await prisma.player.update({
      where: { id: req.params.id },
      data: {
        position,
        phoneNumber,
        location,
        skills,
        experience: experience ? parseInt(experience) : null,
        bio,
        availability,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    res.json(updatedPlayer)
  } catch (error) {
    res.status(500).json({ message: 'Error updating player profile' })
  }
}

exports.getAllPlayers = async (req, res) => {
  try {
    const players = await prisma.player.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
    res.json(players)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching players' })
  }
}

exports.searchPlayers = async (req, res) => {
  try {
    const { location, position, availability } = req.query

    const filters = {}
    if (location) filters.location = { contains: location, mode: 'insensitive' }
    if (position) filters.position = { contains: position, mode: 'insensitive' }
    if (availability) filters.availability = availability

    const players = await prisma.player.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    res.json(players)
  } catch (error) {
    res.status(500).json({ message: 'Error searching players' })
  }
}

// Rating Controllers
exports.ratePlayer = async (req, res) => {
  try {
    const { value, comment } = req.body
    const toPlayerId = req.params.id

    // Get rater's player profile
    const fromPlayer = await prisma.player.findUnique({
      where: { userId: req.user.id },
    })

    if (!fromPlayer) {
      return res.status(400).json({ message: 'You must create a player profile to rate others' })
    }

    if (fromPlayer.id === toPlayerId) {
      return res.status(400).json({ message: 'You cannot rate yourself' })
    }

    // Create rating
    const rating = await prisma.rating.create({
      data: {
        value: parseFloat(value),
        comment,
        fromPlayerId: fromPlayer.id,
        toPlayerId,
      },
    })

    // Update player's average rating
    const allRatings = await prisma.rating.findMany({
      where: { toPlayerId },
    })

    const averageRating = allRatings.reduce((acc, curr) => acc + curr.value, 0) / allRatings.length

    await prisma.player.update({
      where: { id: toPlayerId },
      data: {
        rating: averageRating,
        totalRatings: allRatings.length,
      },
    })

    res.status(201).json(rating)
  } catch (error) {
    res.status(500).json({ message: 'Error creating rating' })
  }
}

// Post Controllers
exports.createPost = async (req, res) => {
  try {
    const { title, content, type, location } = req.body

    const player = await prisma.player.findUnique({
      where: { userId: req.user.id },
    })

    if (!player) {
      return res.status(400).json({ message: 'You must create a player profile to post' })
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        type,
        location,
        playerId: player.id,
      },
      include: {
        player: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' })
  }
}

exports.getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        player: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        comments: {
          include: {
            player: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' })
  }
}

exports.getPost = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        player: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        comments: {
          include: {
            player: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.json(post)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post' })
  }
}

exports.updatePost = async (req, res) => {
  try {
    const { title, content, type, location } = req.body

    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: { player: true },
    })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.player.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const updatedPost = await prisma.post.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        type,
        location,
      },
      include: {
        player: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    res.json(updatedPost)
  } catch (error) {
    res.status(500).json({ message: 'Error updating post' })
  }
}

exports.deletePost = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: { player: true },
    })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Allow deletion if user is admin or post owner
    if (post.player.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    // Delete related comments first if necessary
    await prisma.comment.deleteMany({
      where: { postId: req.params.id },
    })

    // Delete the post
    await prisma.post.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).json({ message: 'Error deleting post', error: error.message })
  }
}

// Comment Controllers
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body
    const postId = req.params.id

    const player = await prisma.player.findUnique({
      where: { userId: req.user.id },
    })

    if (!player) {
      return res.status(400).json({ message: 'You must create a player profile to comment' })
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        playerId: player.id,
      },
      include: {
        player: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment' })
  }
}

exports.deleteComment = async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.id },
      include: { player: true },
    })

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    if (comment.player.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await prisma.comment.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment' })
  }
}

exports.updatePlayerStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { availability } = req.body

    // Check if player exists and belongs to user
    const player = await prisma.player.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!player) {
      return res.status(404).json({ message: 'Player not found' })
    }

    if (player.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    // Update player status
    const updatedPlayer = await prisma.player.update({
      where: { id },
      data: { availability },
    })

    res.json(updatedPlayer)
  } catch (error) {
    res.status(500).json({ message: 'Error updating player status' })
  }
}
