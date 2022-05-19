const Post = require('../models/post')
const Message = require('../models/message')
const User = require('../models/user')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const successHandler = require('../service/handleSuccess')

const message = {
  addMessage: handleErrorAsync(async (req, res, next) => {
    const { postId } = req.params
    const { user, content } = req.body

    if (!user || !content || !postId) return appError(404, '請輸入必填欄位', next)

    const currentPost = await Post.findById(postId)
    const currentUser = await User.findById(user)

    if (!currentUser) return appError(404, '無此使用者', next)
    if (!currentPost) return appError(404, '無此貼文', next)

    const newMessage = await Message.create({
      user,
      content
    })

    const result = await Post.findByIdAndUpdate(postId, {
      $push: {
        messages: newMessage._id
      }
    }, { new: true })

    successHandler(res, '成功上傳留言', result)
  }),

  editMessage: handleErrorAsync(async (req, res, next) => {
    const { content } = req.body
    const id = req.params.postId

    if (!content) {
      return appError(400, '留言內容不可為空', next)
    }

    const result = await Message.findByIdAndUpdate(id, {
      content,
      updatedAt: Date.now()
    }, { new: true })

    return successHandler(res, 'update messages success', result)
  }),

  deleteMessage: handleErrorAsync(async (req, res, next) => {
    const { user } = req.body
    const { postId, messageId } = req.params

    if (!user) return appError(404, '未指定留言者', next)

    const currentPost = await Post.findById(postId)
    const currentUser = await User.findById(user)
    const currentMessage = await Message.findById(messageId)

    if (!currentPost) return appError(404, '無此貼文', next)
    if (!currentUser) return appError(404, '無此留言者', next)
    if (!currentMessage) return appError(404, '無此流言', next)

    const updatePost = await Post.findByIdAndUpdate(postId, {
      $pull: {
        messages: messageId
      }
    }, { new: true })
    const deleteMessage = await Message.findByIdAndDelete(messageId)

    successHandler(res, '刪除成功', {
      post: updatePost,
      message: deleteMessage
    })
  }),

  // 測試用
  getAllMessage: async (req, res, next) => {
    const messages = await Message.find()
    successHandler(res, 'success', messages)
  }
}

module.exports = message
