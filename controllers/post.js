const validator = require('validator')
const handleErrorAsync = require('../service/handleErrorAsync')
const successHandler = require('../service/handleSuccess')
const appError = require('../service/appError')
const Post = require('../models/post')
const { postImage } = require('./images')

async function editPost (req, res, next) {
  const { content, image } = req.body
  const id = req.params.postId

  if (!content) {
    return appError(400, '貼文內容不可為空', next)
  }

  if (image) {
    postImage(req, res)
  }

  Post.findByIdAndUpdate(id, {
    content
  }).then(() => successHandler(res, 'update messages success', Post.findById(id)))
}

module.exports = {
  editPost: handleErrorAsync(editPost)
}
