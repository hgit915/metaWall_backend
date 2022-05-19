const express = require('express')
const router = express.Router()
const PostController = require('../controllers/posts')
const MessageController = require('../controllers/message')
const LikeController = require('../controllers/like')

// post
router.get('/', PostController.getManyPost)
router.post('/', PostController.addPost)
router.patch('/:postId', PostController.editPost)
router.delete('/:id', PostController.deletePost)

// messages
router.get('/messages', MessageController.getAllMessage)
router.post('/:postId/message', MessageController.addMessage)
router.patch('/:postId/message', MessageController.editMessage)
router.delete('/:postId/:messageId', MessageController.deleteMessage)

// likes
router.get('/likes', LikeController.getLikePost)
router.post('/:postId/like', LikeController.addLike)
router.delete('/:postId/like', LikeController.deleteLike)

module.exports = router
