const mongoose = require('mongoose')
const chatImgSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    img: {
      type: String,
      default: []
    },
    createdAt: {
      type: Date,
      default: Date.now
      // select: false
    }
  },
  {
    versionKey: false,
    new: true
  }
)
const chatImg = mongoose.model('ChatImg', chatImgSchema)

module.exports = chatImg
