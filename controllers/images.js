const { Readable } = require('stream')
const { uploadFile, getFileById } = require('../service/s3/s3')
const successHandler = require('../service/handleSuccess')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const RequestBlocker = require('../service/blocker/RequestBlocker')
const {
  isFileExist,
  isFieldNameImage,
  isImageType,
  isFileSizeLessThan1MB,
  isImageWidthGreaterThan300,
  isImage1And1Ratio
} = require('../service/blocker/rule/image-rule')

async function getImage (req, res, next) {
  if (!req.params.key) {
    return appError('404', 'fetch image requires a key!!', next)
  }

  const { key } = req.params
  if (!key) {
    return appError('404', 'key required!!', next)
  }

  const buffer = (await getFileById(key)).Body

  return Readable.from(buffer).pipe(res)
}

async function postImage (req, res, next) {
  const errorData = new RequestBlocker(req)
    .setBlocker(
      isFileExist,
      isFieldNameImage,
      isImageType,
      isFileSizeLessThan1MB,
      isImageWidthGreaterThan300,
      isImage1And1Ratio
    ).getErrorData()

  if (errorData) {
    const { statusCode, errorMessage } = errorData
    return appError(statusCode, errorMessage, next)
  }

  const result = await uploadFile(req.file)
  return successHandler(res, 'upload image success', {
    imageUrl: result.Key
  })
}

module.exports = {
  getImage: handleErrorAsync(getImage),
  postImage: handleErrorAsync(postImage)
}
