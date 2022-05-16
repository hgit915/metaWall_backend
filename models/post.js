const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  { 
    user: { 
      type: String 
    },
    image: { 
      type: String 
    },
    content: {
      type: String,
      required: [true, '請輸入貼文內容'],
    },
    likes: {
      type: Array 
    },
    messages: {
       type: Array 
    },
    tag: {
      default: '日常',
      enum: ['新聞','討論','日常']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }  
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('Post', schema)
