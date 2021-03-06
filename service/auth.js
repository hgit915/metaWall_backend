const jwt = require('jsonwebtoken')
const appError = require('../service/appError')
const User = require('../models/user')
const isAuth = async (req, res, next) => {
  // 確認 token 是否存在
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(appError(401, '你尚未登入！', next))
  }

  // 驗證 token 正確性
  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          reject(err)
        } else {
          resolve(payload)
        }
      })
    })
    const currentUser = await User.findById(decoded.id).select('+googleId +facebookId')
    req.user = currentUser
    next()
  } catch (error) {
    return appError(404, error.message, next)
  }
}

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  })
}

const generateSendJWT = (user, statusCode, res) => {
  // 產生 JWT token
  const token = generateToken(user)
  user.password = undefined
  res.status(statusCode).json({
    status: 'success',
    message: 'success',
    data: {
      token,
      name: user.name
    }
  })
}

const generateUrlJWT = (res, user) => {
  const token = generateToken(user)
  user.password = undefined
  res.redirect(`${process.env.FONTEND_URL}/oauth?token=${token}`)
}
module.exports = {
  isAuth,
  generateToken,
  generateSendJWT,
  generateUrlJWT
}
