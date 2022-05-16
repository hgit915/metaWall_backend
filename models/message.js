const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    content: {
      type: String,
      required: [true, '請輸入留言內容'],
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }, 
    
  },
  { 
    versionKey: false 
  }
)

const Message = mongoose.model('Message', schema)

module.exports = Message
