const express = require('express')
const router = express.Router()
const TrackController = require('../controllers/tracks')
const handleErrorAsync = require('../service/handleErrorAsync')

const { isAuth } = require('../service/auth')

// 追蹤者
router.get('/', isAuth, handleErrorAsync(TrackController.getTrackList))
router.post('/:trackId', isAuth, handleErrorAsync(TrackController.addTrack))
router.delete('/:trackId', isAuth, handleErrorAsync(TrackController.deleteTrack))

module.exports = router
