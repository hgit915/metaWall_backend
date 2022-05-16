const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    tracking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now
    }    
  },
  { 
    versionKey: false 
  }
)

const Track = mongoose.model('Track', schema)

module.exports = Track
