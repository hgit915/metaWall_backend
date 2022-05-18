const Message = require('../models/message')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const successHandler = require('../service/handleSuccess')

const messages = {
  editMessage: handleErrorAsync(async (req, res, next) => {
    const { content } = req.body
    const id = req.params.postId

    if (!content) {
      return appError(400, '留言內容不可為空', next)
    }

    const result = Message.findByIdAndUpdate(id, {
      content,
      updatedAt: Date.now()
    }, { new: true })

    return successHandler(res, 'update messages success', result)
  })
}

module.exports = messages
