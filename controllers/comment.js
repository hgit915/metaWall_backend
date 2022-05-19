const Post = require('../models/post')
const Comment = require('../models/comment')
const User = require('../models/user')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const successHandler = require('../service/handleSuccess')

const comment = {
  addComment: handleErrorAsync(async (req, res, next) => {
    const { postId } = req.params
    const { user, content } = req.body

    if (!user || !content || !postId) return appError(404, '請輸入必填欄位', next)

    const currentPost = await Post.findById(postId)
    const currentUser = await User.findById(user)

    if (!currentUser) return appError(404, '無此使用者', next)
    if (!currentPost) return appError(404, '無此貼文', next)

    const newComment = await Comment.create({
      user,
      content
    })

    const result = await Post.findByIdAndUpdate(postId, {
      $push: {
        comment: newComment._id
      }
    }, { new: true })

    successHandler(res, '成功上傳留言', result)
  }),

  editComment: handleErrorAsync(async (req, res, next) => {
    const { content } = req.body
    const id = req.params.postId

    if (!content) {
      return appError(400, '留言內容不可為空', next)
    }

    const result = await Comment.findByIdAndUpdate(id, {
      content,
      updatedAt: Date.now()
    }, { new: true })

    return successHandler(res, 'update comments success', result)
  }),

  deleteComment: handleErrorAsync(async (req, res, next) => {
    const { user } = req.body
    const { postId, commentId } = req.params

    if (!user) return appError(404, '未指定留言者', next)

    const currentPost = await Post.findById(postId)
    const currentUser = await User.findById(user)
    const currentComment = await Comment.findById(commentId)

    if (!currentPost) return appError(404, '無此貼文', next)
    if (!currentUser) return appError(404, '無此留言者', next)
    if (!currentComment) return appError(404, '無此流言', next)

    const updatePost = await Post.findByIdAndUpdate(postId, {
      $pull: {
        comments: commentId
      }
    }, { new: true })
    const deleteComment = await Comment.findByIdAndDelete(commentId)

    successHandler(res, '刪除成功', {
      post: updatePost,
      comment: deleteComment
    })
  }),

  // 測試用
  getAllComment: async (req, res, next) => {
    const comment = await Comment.find()
    successHandler(res, 'success', comment)
  }
}

module.exports = comment
