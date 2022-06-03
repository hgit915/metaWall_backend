const Post = require('../models/post')
const successHandler = require('../service/handleSuccess')
const isPositiveInteger = require('../helpers/isPositiveInteger')
const appError = require('../service/appError')

/** 預設一頁幾筆資料 */
const defaultPageSize = 10
const defaultPageIndex = 1

const like = {
  getLikePost: async (req, res, next) => {
    const { pageIndex, pageSize } = req.query

    const currentPageIndex = isPositiveInteger(pageIndex) ? pageIndex : defaultPageIndex
    const currentPageSize = isPositiveInteger(pageSize) ? pageSize : defaultPageSize

    const posts = await Post.find({
      likes: {
        $in: req.user._id
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
  },

  like: async (req, res, next) => {
    const { postId } = req.params

    const filter = {
      _id: postId,
      likes: { $nin: req.user._id }
    }

    const updatePost = await Post.findOneAndUpdate(filter, {
      $push: {
        likes: req.user._id
      }
    }, { new: true })

    if (!updatePost) {
      return appError(404, '按讚錯誤', next)
    }

    successHandler(res, '成功更新讚數', updatePost)
  },

  unLike: async (req, res, next) => {
    const { postId } = req.params

    const filter = {
      _id: postId,
      likes: { $in: req.user._id }
    }

    const updatePost = await Post.findOneAndUpdate(filter, {
      $pull: {
        likes: req.user._id
      }
    }, { new: true })

    if (!updatePost) {
      return appError(404, '取消讚錯誤', next)
    }

    successHandler(res, '成功移除按讚', updatePost)
  }
}

module.exports = like
