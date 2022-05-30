const express = require('express')
const router = express.Router()
const PostController = require('../controllers/posts')
const CommentController = require('../controllers/comment')
const LikeController = require('../controllers/like')
const { isAuth } = require('../service/auth')

// post貼文
router.get('/', isAuth, PostController.getManyPost)
router.get('/:userId/user', isAuth, PostController.getUserPost)
router.get('/single/:postId', isAuth, PostController.getPost)
router.post('/', isAuth, PostController.addPost)
router.patch('/:postId', isAuth, PostController.editPost)
router.delete('/:id', isAuth, PostController.deletePost)

// comment評論
router.get('/comments', isAuth, CommentController.getAllComment) // 測試用
router.post('/:postId/comment', isAuth, CommentController.addComment)
router.patch('/:postId/comment/:commentId', isAuth, CommentController.editComment)
router.delete('/:postId/comment/:commentId', isAuth, CommentController.deleteComment)

// likes按讚
router.get('/likes', isAuth, LikeController.getLikePost)
router.patch('/:postId/like', isAuth, LikeController.like)
router.patch('/:postId/unlike', isAuth, LikeController.unLike)

module.exports = router
