const Post = require('../models/post')
const Comment = require('../models/comment')
const successHandler = require('../service/handleSuccess')
const appError = require('../service/appError')
const checkValueCanSort = require('../helpers/checkSort')
const isPositiveInteger = require('../helpers/isPositiveInteger')
const parseObjectId = require('../helpers/parseObjectId')
const { getFileInfoById } = require('../service/s3/s3')
const ObjectId = require('mongoose').Types.ObjectId

/** 預設一頁幾筆資料 */
const defaultPageSize = 10
const defaultPageIndex = 1
const defaultSort = 'desc'

const post = {
  getManyPost: async (req, res) => {
    // 除了q傳遞搜尋字串之外，其他值皆屬排序
    const {
      q,
      likes,
      comments,
      createdAt = defaultSort,
      pageIndex,
      pageSize,
      _id
    } = req.query

    const currentPageIndex = isPositiveInteger(pageIndex)
      ? pageIndex
      : defaultPageIndex
    const currentPageSize = isPositiveInteger(pageSize)
      ? pageSize
      : defaultPageSize

    const filterByQuery = {}
    if (q) {
      filterByQuery.content = new RegExp(`${q}`, 'i')
    }
    if (_id) {
      filterByQuery._id = ObjectId(_id)
    }

    const filterBySort = {}
    if (checkValueCanSort(likes)) {
      filterBySort.likes = likes
    }
    if (checkValueCanSort(comments)) {
      filterBySort.comments = comments
    }
    if (checkValueCanSort(createdAt)) {
      filterBySort.createdAt = createdAt
    }

    const posts = await Post.find(filterByQuery)
      .populate({
        path: 'user',
        select: 'name photo'
      })
      .populate({
        path: 'comments',
        select: 'user content createdAt',
        populate: {
          path: 'user',
          select: 'name photo'
        }
      })
      .populate({
        path: 'likes'
      })
      .sort(filterBySort)
      .skip((currentPageIndex - 1) * currentPageSize)
      .limit(currentPageSize)

    successHandler(res, 200, posts)
  },

  getUserPost: async (req, res, next) => {
    const user = req.params.userId
    const {
      q,
      likes,
      comments,
      createdAt = defaultSort,
      pageIndex,
      pageSize
    } = req.query

    const currentPageIndex = isPositiveInteger(pageIndex)
      ? pageIndex
      : defaultPageIndex
    const currentPageSize = isPositiveInteger(pageSize)
      ? pageSize
      : defaultPageSize

    const filterByQuery = q
      ? { user, content: new RegExp(`${q}`, 'i') }
      : { user }
    const filterBySort = {}

    if (checkValueCanSort(likes)) { filterBySort.likes = likes }
    if (checkValueCanSort(comments)) { filterBySort.comments = comments }
    if (checkValueCanSort(createdAt)) { filterBySort.createdAt = createdAt }

    const result = await Post.find(filterByQuery)
      .populate({
        path: 'user',
        select: 'name photo'
      })
      .populate({
        path: 'comments',
        select: 'user content createdAt',
        populate: {
          path: 'user',
          select: 'name photo'
        }
      })
      .populate({
        path: 'likes'
      })
      .sort(filterBySort)
      .skip((currentPageIndex - 1) * currentPageSize)
      .limit(currentPageSize)

    const msg = result.length === 0 ? '查無相關貼文' : '200'
    successHandler(res, msg, result)
  },

  addPost: async (req, res, next) => {
    // image是傳id值
    const { content, image } = req.body
    if (!content) return appError(404, '請輸入必填欄位', next)

    // 處理沒有圖片的提交
    if (!image) {
      const result = await Post.create({ content, user: req.user._id })
      res.io.emit('newPost', result)
      return successHandler(res, 200, result)
    }

    const isImageInS3 = await getFileInfoById(image)
    const result = await Post.create({
      content,
      image: isImageInS3 ? image : '',
      user: req.user._id
    })
    res.io.emit('newPost', result)
    return successHandler(res, 200, result)
  },

  editPost: async (req, res, next) => {
    const { content, image } = req.body
    const id = req.params.postId

    if (!content && !image) {
      return appError(400, '編輯貼文、圖片需擇一更新，不可皆為空', next)
    }

    const post = await Post.findById(id)
    if (!post) {
      return appError(400, '貼文不存在', next)
    }

    const updateQuery = {
      content,
      updatedAt: Date.now()
    }

    if (image) {
      const isImageInS3 = await getFileInfoById(image)
      if (!isImageInS3) {
        return appError(400, '該圖片不存在在雲端', next)
      }
      updateQuery.image = image
    }

    const result = await Post.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true }
    )

    return successHandler(res, 'update comment success', result)
  },

  deletePost: async (req, res, next) => {
    const deletePost = await Post.findByIdAndDelete(req.params.id)
    if (!deletePost) {
      return appError(404, '刪除錯誤，沒有id ?', next)
    }

    if (!deletePost.comments?.length) {
      return successHandler(res, '刪除成功', deletePost)
    }

    const commentIdList = deletePost.comments.map((objectId) =>
      parseObjectId(objectId)
    )
    const deleteComment = await Comment.deleteMany({
      id: {
        $in: commentIdList
      }
    })

    successHandler(res, 200, {
      deletePost,
      deleteComment
    })
  },

  getPost: async (req, res, next) => {
    const id = req.params.postId

    const post = await Post.findById(id)
    if (!post) {
      return appError(400, '貼文不存在', next)
    }

    const result = await Post.findById(id)
      .populate({
        path: 'user',
        select: 'name photo'
      })
      .populate({
        path: 'comments',
        select: 'user content createdAt',
        populate: {
          path: 'user',
          select: 'name photo'
        }
      })
      .populate({
        path: 'likes'
      })

    return successHandler(res, 200, result)
  }
}

module.exports = post
