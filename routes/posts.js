const express = require('express')
const router = express.Router()
const PostsControllers = require('../controllers/posts')

router.get('/', PostsControllers.getManyPost)
router.post('/', PostsControllers.addPost)
router.delete('/:id', PostsControllers.deletePost)

module.exports = router
