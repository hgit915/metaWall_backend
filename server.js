const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const resError = require('./service/resError')
const dotenv = require('dotenv')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auths')
const postsRouter = require('./routes/posts')
const trackRouter = require('./routes/tracks')
const imagesRouter = require('./routes/images')
const appError = require('./service/appError')
const swaggerUI = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')

require('dotenv').config()
dotenv.config({ path: './.env' })

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

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    secret: process.env.JWT_SECRET, // secret: 定義一組屬於你的字串做為私鑰
    resave: false,
    saveUninitialized: false
  })
)

// 使用 Passport
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

// socket.io
const io = require('socket.io')()
app.io = io
require('./utils/socketServer.js')(io)
app.use(function (req, res, next) {
  res.io = io
  next()
})

app.use(usersRouter)
app.use('/auth', authRouter)
app.use('/images', imagesRouter)
app.use('/posts', postsRouter)
app.use('/tracks', trackRouter)
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile))

app.use((_req, res, next) => {
  appError(404, '找不到路徑', next)
})

app.use((err, req, res, next) => {
  // dev
  err.statusCode = err.statusCode || 500
  if (process.env.NODE_ENV === 'dev') {
    return resError.resErrorDev(err, res)
  }
  // production
  if (err.name === 'ValidationError') {
    err.message = '資料欄位未填寫正確，請重新輸入！'
    err.isOperational = true
    return resError.resErrorProd(err, res)
  }
  resError.resErrorProd(err, res)
})
module.exports = app
