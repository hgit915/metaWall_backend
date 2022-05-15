const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    userName: { type: String, required: [true, '發文者名稱為必填'] },
    userPhoto: { type: String, required: [true, '發文者照片為必填'] },
    imageUrl: { type: String },
    content: { type: String },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('Post', schema)
