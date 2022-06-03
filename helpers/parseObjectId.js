const mongoose = require('mongoose')
/**
 * 轉換格式為正確id
 * e.g. new ObjectId("6285c64e1fe741cd723444b3") => 6285c64e1fe741cd723444b3
 */
function parseObjectId (obj) {
  if (mongoose.Types.ObjectId.isValid(obj)) {
    return obj._id.toString()
  }

  if (typeof obj === 'string') {
    return obj.split('ObjectId')[1].split('"')[1]
  }

  return undefined
}

module.exports = parseObjectId
