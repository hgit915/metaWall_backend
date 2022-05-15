const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const usersRouter = require('./routes/users')

require('dotenv').config()
dotenv.config({ path: './.env' })

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('資料庫連線成功')
  })
  .catch((e) => {
    console.log(e.reason)
  })

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/users', usersRouter)
app.use((req, res, next) => {
  res.status(400).json({
    status: 'error',
    message: '找不到路徑'
  })
})

module.exports = app
