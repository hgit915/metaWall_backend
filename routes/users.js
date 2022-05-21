const express = require('express')
const router = express.Router()
const UsersControllers = require('../controllers/users')
const { isAuth } = require('../service/auth')

// 登入相關
router.post('/sign_up', UsersControllers.signUp)
router.post('/sign_in', UsersControllers.signIn)

// 使用者相關
router.patch('/users/password', isAuth, UsersControllers.updatePassword)
router.patch('/users/me', isAuth, UsersControllers.updateUserInfo)
router.get('/users/me', isAuth, UsersControllers.getUserInfo)

// 測試方便用
router.get('/users/', isAuth, UsersControllers.getAllUser)
router.delete('/users/:id', isAuth, UsersControllers.deleteUser)

module.exports = router
