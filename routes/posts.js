const express = require('express')
const router = express.Router()
const PostsControllers = require('../controllers/posts')
const MessagesControllers = require('../controllers/message')

router.post('/:postId', PostsControllers.editPost)
router.post('/:postId/message', MessagesControllers.editMessage)

router.get('/', PostsControllers.getManyPost)
router.post('/', PostsControllers.addPost)
router.delete('/:id', PostsControllers.deletePost)

module.exports = router
