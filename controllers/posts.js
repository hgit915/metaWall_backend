const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')
const successHandler = require('../service/handleSuccess')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const checkValueCanSort = require('../helpers/checkSort')
const isPositiveInteger = require('../helpers/isPositiveInteger')
const { getFileInfo } = require('../service/s3/s3')
const parseObjectId = require('../helpers/parseObjectId')
const { postImage } = require('./images')

/** 預設一頁幾筆資料 */
const defaultPageSize = 10
const defaultPageIndex = 1
const defaultSort = 'desc'

const post = {
  getManyPost: handleErrorAsync(async (req, res) => {
    // 除了q傳遞搜尋字串之外，其他值皆屬排序
    const {
      q, likes, comments, createdAt = defaultSort,
      pageIndex, pageSize
    } = req.query

    const currentPageIndex = isPositiveInteger(pageIndex) ? pageIndex : defaultPageIndex
    const currentPageSize = isPositiveInteger(pageSize) ? pageIndex : defaultPageSize

    const filterByQuery = q ? { content: new RegExp(`${q}`, 'i') } : {}
    const filterBySort = {}

    if (checkValueCanSort(likes)) filterBySort.likes = likes
    if (checkValueCanSort(comments)) filterBySort.comments = comments
    if (checkValueCanSort(createdAt)) filterBySort.createdAt = createdAt

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
  }),

  addPost: handleErrorAsync(async (req, res, next) => {
    // image是傳id值
    const { content, image, user } = req.body
    if (!content || !user) return appError(404, '請輸入必填欄位', next)

    const currentUser = await User.findById(user)
    if (!currentUser) return appError(404, 'invaild user', next)

    // 處理沒有圖片的提交
    if (!image) {
      const result = await Post.create({ content, user })
      return successHandler(res, 200, result)
    }

    const isImageInS3 = await getFileInfo(image)
    const result = await Post.create({
      content,
      image: isImageInS3 ? image : '',
      author: req.user.id
    })
    return successHandler(res, 200, result)
  }),

  editPost: handleErrorAsync(async (req, res, next) => {
    const { content, image } = req.body
    const id = req.params.postId

    if (!content) {
      return appError(400, '貼文內容不可為空', next)
    }

    const post = await Post.findByIdAndUpdate(id, { content }, { new: true })
    if (!post) return appError(400, '貼文不存在', next)

    const result = await Post.findByIdAndUpdate(id, {
      content,
      updatedAt: Date.now()
    }, { new: true })

    return successHandler(res, 'update comment success', result)
  }),

  deletePost: handleErrorAsync(async (req, res, next) => {
    const deletePost = await Post.findByIdAndDelete(req.params.id)
    if (!deletePost) return appError(404, '刪除錯誤，沒有id ?', next)

    if (!deletePost.comments?.length) return

    const commentIdList = deletePost.comments.map(objectId => parseObjectId(objectId))

    // 防呆一下
    if (!commentIdList[0]) return appError(404, 'id格式轉換錯誤瞜', next)

    const deleteComment = await Comment.deleteMany({
      id: {
        $in: commentIdList
      }
    })

    successHandler(res, 200, {
      deletePost,
      deleteComment
    })
  })
}

module.exports = post
