const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const {
  createPlayerProfile,
  getPlayerProfile,
  updatePlayerProfile,
  getAllPlayers,
  searchPlayers,
  ratePlayer,
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  updatePlayerStatus,
} = require('../controllers/communityController')

// Player routes
router.route('/players').post(protect, createPlayerProfile).get(getAllPlayers)

router.route('/players/search').get(searchPlayers)

router.route('/players/:id').get(getPlayerProfile).put(protect, updatePlayerProfile)

// Rating routes
router.route('/players/:id/rate').post(protect, ratePlayer)

// Post routes
router.route('/posts').post(protect, createPost).get(getPosts)

router.route('/posts/:id').get(getPost).put(protect, updatePost).delete(protect, deletePost)

// Comment routes
router.route('/posts/:id/comments').post(protect, addComment)

router.route('/comments/:id').delete(protect, deleteComment)

// Add this route
router.put('/players/:id/update-status', protect, updatePlayerStatus)

module.exports = router
