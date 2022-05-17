const express = require('express')
const router = express.Router()
const PostsControllers = require('../controllers/post')

router.get('/', async (req, res, next) => {
  // 這段在幫忙處理一下  感謝
  // else if (url.startsWith('/post/') && method === 'GET') {
  //   const type = req.url.split('=').pop().split('?').shift()
  //   const keyText = new RegExp(decodeURI(req.url.split('?').pop()))
  //   let posts = ''
  //   if (type == 'new') {
  //     posts = await Post.find({ content: keyText }).sort({ createdAt: -1 })
  //   } else if (type == 'keyword') {
  //     posts = await Post.find({ content: keyText })
  //   }
  //   res.writeHead(200, header)
  //   res.write(
  //     JSON.stringify({
  //       status: 'success',
  //       data: posts
  //     })
  //   )
  //   res.end()
  // }
  const posts = await Post.find()
  res.status(200).json({
    status: 'success',
    data: posts
  })
})

router.post('/', async (req, res, next) => {
  try {
    const { userName, userPhoto, imageUrl, content } = req.body
    const post = await Post.create({ userName, userPhoto, imageUrl, content })
    res.status(200).json({
      status: 'success',
      data: post
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      data: error
    })
  }
})

module.exports = router
