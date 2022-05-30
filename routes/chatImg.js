const express = require('express')
const router = express.Router()
const chatImgControllers = require('../controllers/chatImg')
const { isAuth } = require('../service/auth')

router.get('/', isAuth, chatImgControllers.getImgs)

module.exports = router
