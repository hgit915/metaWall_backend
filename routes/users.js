const express = require('express')
const router = express.Router()
const UsersControllers = require('../controllers/users')
const handleErrorAsync = require('../service/handleErrorAsync')
const { isAuth } = require('../service/auth')

// 登入相關
router.post('/sign_up', handleErrorAsync(UsersControllers.signUp))
router.post('/sign_in', handleErrorAsync(UsersControllers.signIn))

// 使用者相關
router.patch('/users/password', isAuth, handleErrorAsync(UsersControllers.updatePassword))
router.patch('/users/me', isAuth, handleErrorAsync(UsersControllers.updateUserInfo))
router.get('/users/me', isAuth, handleErrorAsync(UsersControllers.getUserInfo))
router.get('/users/:userId', isAuth, handleErrorAsync(UsersControllers.getPeopleInfo))

// 測試方便用
router.get('/users/', isAuth, handleErrorAsync(UsersControllers.getAllUser))
router.delete('/users/:id', isAuth, handleErrorAsync(UsersControllers.deleteUser))

module.exports = router
