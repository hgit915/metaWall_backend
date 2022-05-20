const express = require('express')
const router = express.Router()
const UsersControllers = require('../controllers/users')
const { isAuth } = require('../service/auth')

router.post('/sign_up', UsersControllers.signUp)
router.post('/sign_in', UsersControllers.signIn)
router.patch('/password', isAuth, UsersControllers.updatePassword)
router.patch('/me', isAuth, UsersControllers.updateUserInfo)
router.get('/me', isAuth, UsersControllers.getUserInfo)

// 測試方便用
router.get('/', isAuth, UsersControllers.getAllUser)
router.delete('/:id', isAuth, UsersControllers.deleteUser)

module.exports = router
