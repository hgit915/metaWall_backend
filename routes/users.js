const express = require('express')
const router = express.Router()
const UsersControllers = require('../controllers/users')

router.post('/sign_up', UsersControllers.signUp)
router.post('/sign_in', UsersControllers.signIn)

module.exports = router
