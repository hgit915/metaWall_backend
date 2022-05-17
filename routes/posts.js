const express = require('express')
const router = express.Router()
const { editPost } = require('../controllers/post')
const { editMessage } = require('../controllers/message')

router.post('/:postId', editPost)
router.post('/:postId/message', editMessage)

module.exports = router
