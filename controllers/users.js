const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Track = require('../models/track')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const successHandler = require('../service/handleSuccess')
const RequestBlocker = require('../service/blocker/RequestBlocker')
const { generateSendJWT } = require('../service/auth')
const { getFileInfoById } = require('../service/s3/s3')
const { atLeastOneRequired } = require('../service/blocker/rule/common-rule')
const {
  isEmailHasntBeenRegistered,
  haveNameEmailPassword,
  isNameLengthGreaterThanTwo,
  isPasswordLengthGreaterThanEight,
  isEmailCorrectFormat,
  hasNameAndNameLengthGreaterThanTwo,
  hadGenderAndValueValid
} = require('../service/blocker/rule/user-rule')

const users = {
  signUp: handleErrorAsync(async (req, res, next) => {
    const errorData = await new RequestBlocker(req)
      .setBlocker(
        haveNameEmailPassword,
        isEmailCorrectFormat,
        isEmailHasntBeenRegistered,
        isNameLengthGreaterThanTwo,
        isPasswordLengthGreaterThanEight
      ).getErrorDataAsync()

    if (errorData) {
      const { statusCode, errorMessage } = errorData
      return appError(statusCode, errorMessage, next)
    }

    let { email, password, name } = req.body

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
  }),

  getUserInfo: handleErrorAsync(async (req, res, next) => {
    const userData = await User.findById(req.user._id)
    successHandler(res, '取得用戶資料成功', userData)
  }),
  getPeopleInfo: handleErrorAsync(async (req, res, next) => {
    const id = req.params.userId
    const userData = await User.findById(id)

    if (!userData) {
      return appError(400, '該用戶不存在', next)
    }

    // 被追蹤人數
    const tracks = await Track.find({
      tracking: {
        _id: id
      }
    }).count()

    const { _id, name, photo } = userData
    const result = {
      _id,
      name,
      photo,
      trackNum: tracks
    }
    successHandler(res, '取得特定用戶資料成功', result)
  }),
  updateUserInfo: handleErrorAsync(async (req, res, next) => {
    const { name, gender, photo } = req.body

    const errorData = new RequestBlocker(req)
      .setBlocker(
        atLeastOneRequired(name, gender, photo),
        hasNameAndNameLengthGreaterThanTwo,
        hadGenderAndValueValid
      ).getErrorData()

    if (errorData) {
      const { statusCode, errorMessage } = errorData
      return appError(statusCode, errorMessage, next)
    }

    const updateFilter = {}
    if (name) { updateFilter.name = name }
    if (gender) { updateFilter.gender = gender }

    // 沒有photo的情況
    if (!photo) {
      const updateUser = await User.findByIdAndUpdate(req.user._id, updateFilter, { new: true })
      return successHandler(res, '個人資訊更新成功', updateUser)
    }

    // 有photo的情況
    await getFileInfoById(photo)

    const updateUser = await User.findByIdAndUpdate(req.user._id,
      {
        ...updateFilter,
        photo
      },
      { new: true }
    )
    return successHandler(res, '個人資訊更新成功', updateUser)
  }),

  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { confirmPassword, password } = req.body

    if (!confirmPassword || !password) { return appError(404, '請輸入必填欄位', next) }
    if (confirmPassword !== password) { return appError(404, '密碼確認錯誤', next) }

    const checkPassword = isPasswordLengthGreaterThanEight(req)
    if (checkPassword !== true) { return appError(checkPassword.statusCode, checkPassword.errorMessage, next) }

    const newPassword = await bcrypt.hash(req.body.password, 12)
    const updateUser = await User.findByIdAndUpdate(req.user._id, {
      password: newPassword
    }, { new: true })

    successHandler(res, '更新密碼成功', updateUser)
  })
}

module.exports = users
