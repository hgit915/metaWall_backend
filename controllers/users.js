const bcrypt = require('bcryptjs')
const validator = require('validator')
const User = require('../models/user')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const successHandler = require('../service/handleSuccess')
const { generateSendJWT } = require('../service/auth')

const users = {
  signUp: handleErrorAsync(async (req, res, next) => {
    let { email, password, name } = req.body
    const user = await User.findOne({ email })
    if (user) {
      return appError('400', '帳號已被註冊，請替換新的 Email！', next)
    }
    // 內容不可為空
    if (!email || !password || !name) {
      return appError('400', '欄位未填寫正確！', next)
    }
    // 暱稱 2 碼以上
    if (!validator.isLength(name, { min: 2 })) {
      return appError('400', '暱稱至少 2 個字元以上', next)
    }
    // 密碼 8 碼以上
    if (!validator.isLength(password, { min: 8 })) {
      return appError('400', '密碼需至少 8 碼以上，並中英混合', next)
    }
    // 是否為 Email
    if (!validator.isEmail(email)) {
      return appError('400', 'Email 格式不正確', next)
    }

    // 加密密碼
    password = await bcrypt.hash(req.body.password, 12)
    const newUser = await User.create({
      email,
      password,
      name
    })
    generateSendJWT(newUser, 201, res)
  }),

  signIn: handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      return appError(400, '帳號密碼不可為空', next)
    }
    const user = await User.findOne({ email }).select('+password')
    const auth = await bcrypt.compare(password, user.password)
    if (!auth || !user) {
      return appError(400, '帳號或密碼錯誤，請重新輸入！', next)
    }
    generateSendJWT(user, 200, res)
  }),

  getAllUser: async (req, res, next) => {
    const users = await User.find()
    successHandler(res, 'all user', users)
  },

  deleteUser: handleErrorAsync(async (req, res, next) => {
    const deleteUser = await User.findByIdAndDelete(req.params.id)

    successHandler(res, '刪除使用者成功', deleteUser)
  })
}

module.exports = users
