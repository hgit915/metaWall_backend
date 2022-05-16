const multer = require('multer')
const express = require('express')
const router = express.Router()

const upload = multer({ dest: 'uploads/' })
const { getImage, postImage } = require('../controllers/images')

router.get('/:key', getImage)
router.post('/', upload.single('image'), postImage)

module.exports = router
