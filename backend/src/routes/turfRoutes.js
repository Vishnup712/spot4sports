const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const { createTurf, getTurfs, getTurf, updateTurf, deleteTurf } = require('../controllers/turfController')
const { upload } = require('../config/cloudinary')

router.route('/').get(getTurfs).post(protect, upload.array('images', 5), createTurf)

router.route('/:id').get(getTurf).put(protect, upload.array('images', 5), updateTurf).delete(protect, deleteTurf)

module.exports = router
