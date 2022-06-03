const express = require('express')
const router = express.Router()
const PostController = require('../controllers/posts')
const CommentController = require('../controllers/comment')
const LikeController = require('../controllers/like')
const handleErrorAsync = require('../service/handleErrorAsync')
const { isAuth } = require('../service/auth')

// post貼文
router.get('/', isAuth, handleErrorAsync(PostController.getManyPost))
router.get('/:userId/user', isAuth, handleErrorAsync(PostController.getUserPost))
router.get('/single/:postId', isAuth, handleErrorAsync(PostController.getPost))
router.post('/', isAuth, handleErrorAsync(PostController.addPost))
router.patch('/:postId', isAuth, handleErrorAsync(PostController.editPost))
router.delete('/:id', isAuth, handleErrorAsync(PostController.deletePost))

// comment評論
router.get('/comments', isAuth, handleErrorAsync(CommentController.getAllComment)) // 測試用
router.post('/:postId/comment', isAuth, handleErrorAsync(CommentController.addComment))
router.patch('/:postId/comment/:commentId', isAuth, handleErrorAsync(CommentController.editComment))
router.delete('/:postId/comment/:commentId', isAuth, handleErrorAsync(CommentController.deleteComment))

// likes按讚
router.get('/likes', isAuth, handleErrorAsync(LikeController.getLikePost))
router.patch('/:postId/like', isAuth, handleErrorAsync(LikeController.like))
router.patch('/:postId/unlike', isAuth, handleErrorAsync(LikeController.unLike))

module.exports = router
