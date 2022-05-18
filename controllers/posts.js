const Post = require('../models/post')
const successHandler = require('../service/handleSuccess')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const checkValueCanSort = require('../helpers/checkSort')
const isPositiveInteger = require('../helpers/isPositiveInteger')
const { getFileInfo } = require('../service/s3/s3')

/** 預設一頁幾筆資料 */
const defaultPageSize = 10
const defaultPageIndex = 1
const defaultSort = 'desc'

const post = {
  getManyPost: handleErrorAsync(async (req, res) => {
    // 除了q傳遞搜尋字串之外，其他值皆屬排序
    const {
      q, likes, messages, createdAt = defaultSort,
      pageIndex, pageSize
    } = req.query

    const currentPageIndex = isPositiveInteger(pageIndex) ? pageIndex : defaultPageIndex
    const currentPageSize = isPositiveInteger(pageSize) ? pageIndex : defaultPageSize

    const filterByQuery = q ? { content: new RegExp(`${q}`, 'i') } : {}
    const filterBySort = {}

    if (checkValueCanSort(likes)) filterBySort.likes = likes
    if (checkValueCanSort(messages)) filterBySort.messages = messages
    if (checkValueCanSort(createdAt)) filterBySort.createdAt = createdAt

    const posts = await Post.find(filterByQuery)
      // 這邊有問題Schema hasn't been registered for model \"message\".\nUse mongoose.model(name, schema)
      .populate({
        path: 'user',
        select: 'name avator createdAt'
      })
      .populate({
        path: 'messages',
        select: 'user content createdAt',
        populate: {
          path: 'user',
          select: 'name photo'
        }
      })
      .sort(filterBySort)
      .skip((currentPageIndex - 1) * currentPageSize)
      .limit(currentPageSize)

    successHandler(res, 200, posts)
  }),

  addPost: handleErrorAsync(async (req, res, next) => {
    // image是傳id值
    const { content, image } = req.body

    if (!content) return appError('404', 'require content', next)

    if (!image) {
      const result = Post.create({
        content,
        author: req.user.id
      })
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

  deletePost: handleErrorAsync(async (req, res, next) => {
    console.log(req.params)
    console.log('晚點改')
    successHandler(res, 200, 'success')
  })
}

module.exports = post
