const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      require: [true, '請輸入貼文者名稱']
    },
    image: {
      type: String,
      default: ''
    },
    content: {
      type: String, required: [true, '請輸入貼文內容']
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'user',
      default: []
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'comment',
      default: []
    },
    tag: {
      type: [String],
      default: []
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

module.exports = mongoose.model('post', schema)
