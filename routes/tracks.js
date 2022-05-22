const express = require('express')
const router = express.Router()
const TrackController = require('../controllers/tracks')

const { isAuth } = require('../service/auth')

// 追蹤者
router.get('/', isAuth, TrackController.getTrackList)
router.post('/:trackId', isAuth, TrackController.addTrack)
router.delete('/:trackId', isAuth, TrackController.deleteTrack)

module.exports = router
