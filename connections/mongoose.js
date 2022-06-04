const mongoose = require('mongoose')

const connectToMongo = () => {
  const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  )

  mongoose
    .connect(DB)
    .then(() => {
      console.log('資料庫連線成功')
    })
    .catch((e) => {
      console.log(e.reason)
    })
}

module.exports = connectToMongo
