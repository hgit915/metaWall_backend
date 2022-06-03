const multer = require('multer')
const express = require('express')
const router = express.Router()
const handleErrorAsync = require('../service/handleErrorAsync')
const { isAuth } = require('../service/auth')

const upload = multer({ dest: 'uploads/' })
const ImageController = require('../controllers/images')

router.get('/:key', handleErrorAsync(ImageController.getImage))
router.post('/', isAuth, upload.single('image'), handleErrorAsync(ImageController.postImage))

module.exports = router
