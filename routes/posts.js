const express = require('express')
const router = express.Router()
const PostController = require('../controllers/posts')
const CommentController = require('../controllers/comment')
const LikeController = require('../controllers/like')

// post貼文
router.get('/', PostController.getManyPost)
router.post('/', PostController.addPost)
router.patch('/:postId', PostController.editPost)
router.delete('/:id', PostController.deletePost)

// comment評論
router.get('/comments', CommentController.getAllComment)
router.post('/:postId/comment', CommentController.addComment)
router.patch('/:postId/comment', CommentController.editComment)
router.delete('/:postId/:commentId', CommentController.deleteComment)

// likes按讚
router.get('/likes', LikeController.getLikePost)
router.post('/:postId/like', LikeController.addLike)
router.delete('/:postId/like', LikeController.deleteLike)

module.exports = router
