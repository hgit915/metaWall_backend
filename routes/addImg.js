const express = require('express')
const router = express.Router()
const addImgControllers = require('../controllers/addImg')

router.get('/', isAuth, addImgControllers.getImgs)

module.exports = router