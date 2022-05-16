const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    tracking: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }    
  },
  { 
    versionKey: false 
  }
)

const Track = mongoose.model('Track', schema)

module.exports = Track
