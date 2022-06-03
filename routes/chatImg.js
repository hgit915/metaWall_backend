const express = require('express')
const router = express.Router()
const chatImgControllers = require('../controllers/chatImg')
const handleErrorAsync = require('../service/handleErrorAsync')
const { isAuth } = require('../service/auth')

router.get('/', isAuth, handleErrorAsync(chatImgControllers.getImgs))

module.exports = router
