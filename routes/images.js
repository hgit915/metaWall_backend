const multer = require('multer')
const express = require('express')
const router = express.Router()
const { isAuth } = require('../service/auth')

const upload = multer({ dest: 'uploads/' })
const ImageController = require('../controllers/images')

router.get('/:key', isAuth, ImageController.getImage)
router.post('/', isAuth, upload.single('image'), ImageController.postImage)

module.exports = router
