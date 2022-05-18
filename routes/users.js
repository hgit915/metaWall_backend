const express = require('express')
const router = express.Router()
const UsersControllers = require('../controllers/users')

router.post('/sign_up', UsersControllers.signUp)
router.post('/sign_in', UsersControllers.signIn)

// 測試方便用
router.get('/', UsersControllers.getAllUser)
router.delete('/', UsersControllers.deleteUser)

module.exports = router
