const Post = require('../models/post')
const Comment = require('../models/comment')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const successHandler = require('../service/handleSuccess')

const comment = {
  addComment: handleErrorAsync(async (req, res, next) => {
    const { postId } = req.params
    const { content } = req.body

    if (!content) return appError(404, '請輸入評論內容', next)

    await Post.findById(postId)

    const newComment = await Comment.create({
      user: req.user._id,
      content
    })

    const result = await Post.findByIdAndUpdate(postId, {
      $push: {
        comments: newComment._id
      }
    }, { new: true })

    successHandler(res, '成功上傳留言', result)
  }),

  editComment: handleErrorAsync(async (req, res, next) => {
    const { content } = req.body
    const { postId, commentId } = req.params

    if (!content) {
      return appError(400, '留言內容不可為空', next)
    }

    const checkComment = await Post.find({
      _id: postId,
      comments: commentId
    })
    if (checkComment.length === 0) return next(appError(401, '該篇貼文無此留言，請重新確認。', next))

    const result = await Comment.findByIdAndUpdate(commentId, {
      content,
      updatedAt: Date.now()
    }, { new: true })

    return successHandler(res, '更新留言成功', result)
  }),

  deleteComment: handleErrorAsync(async (req, res, next) => {
    const { postId, commentId } = req.params

    await Comment.findByIdAndDelete(commentId)

    const updatePost = await Post.findByIdAndUpdate(postId, {
      $pull: {
        comments: commentId
      }
    }, { new: true })

    successHandler(res, '刪除成功', updatePost)
  }),

  // 測試用
  getAllComment: async (req, res, next) => {
    const comment = await Comment.find()
    successHandler(res, 'success', comment)
  }
}

module.exports = comment
