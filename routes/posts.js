const express = require('express')
const router = express.Router()
const PostsControllers = require('../controllers/posts')
const MessagesControllers = require('../controllers/message')

router.patch('/:postId', PostsControllers.editPost)
router.patch('/:postId/message', MessagesControllers.editMessage)

router.get('/', PostsControllers.getManyPost)
router.post('/', PostsControllers.addPost)
router.delete('/:id', PostsControllers.deletePost)

module.exports = router
