const Post = require('../models/post')
const User = require('../models/user')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const successHandler = require('../service/handleSuccess')
const isPositiveInteger = require('../helpers/isPositiveInteger')

/** 預設一頁幾筆資料 */
const defaultPageSize = 10
const defaultPageIndex = 1

const like = {
  getLikePost: handleErrorAsync(async (req, res, next) => {
    const { user } = req.body
    const { pageIndex, pageSize } = req.query

    if (!user) return appError(404, '請輸入必填欄位', next)

    const currentPageIndex = isPositiveInteger(pageIndex) ? pageIndex : defaultPageIndex
    const currentPageSize = isPositiveInteger(pageSize) ? pageIndex : defaultPageSize

    const posts = await Post.find({
      likes: {
        $in: user
      }
    })
      .populate({
        path: 'user',
        select: 'name photo'
      })
      .select('-comments -likes')
      .sort({ createdAt: 'desc' })
      .skip((currentPageIndex - 1) * currentPageSize)
      .limit(currentPageSize)

    successHandler(res, 200, posts)
  }),

  addLike: handleErrorAsync(async (req, res, next) => {
    const { postId } = req.params
    const { user } = req.body

    if (!user || !postId) return appError(404, '請輸入必填欄位', next)

    const currentUser = await User.findById(user)
    const currentPost = await Post.findById(postId)

    if (!currentUser) return appError(404, '無此使用者', next)
    if (!currentPost) return appError(404, '無此貼文', next)

    const updatePost = await Post.findByIdAndUpdate(postId, {
      $push: {
        likes: user
      }
    }, { new: true })

    successHandler(res, '成功更新讚數', updatePost)
  }),

  deleteLike: handleErrorAsync(async (req, res, next) => {
    const { postId } = req.params
    const { user } = req.body

    if (!user || !postId) return appError(404, '請輸入必填欄位', next)

    const currentUser = await User.findById(user)
    const currentPost = await Post.findById(postId)

    if (!currentUser) return appError(404, '無此使用者', next)
    if (!currentPost) return appError(404, '無此貼文', next)

    const updatePost = await Post.findByIdAndUpdate(postId, {
      $pull: {
        likes: user
      }
    }, { new: true })

    successHandler(res, '成功移除按讚', updatePost)
  })
}

module.exports = like
