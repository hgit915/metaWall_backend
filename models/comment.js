const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, '請填寫留言者']
    },
    content: {
      type: String,
      required: [true, '請輸入留言內容']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
)

const Comment = mongoose.model('comment', schema)

module.exports = Comment
