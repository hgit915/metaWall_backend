require('./types/type')
const sizeOf = require('image-size')

/**
 * 判斷request是否有file屬性
 *
 * @param {Request} req 請求的資訊
 * @returns {true | ErrorInfo} true或者錯誤資訊
 */
function isFileExist (req) {
  return req.file
    ? true
    : {
        errorMessage: 'file required!!',
        statusCode: 404
      }
}

/**
 * 判斷request中的form-data，放入檔案欄位的key是否叫做'image'
 *
 * @param {Request} req 請求的資訊
 * @returns {true | ErrorInfo} true或者錯誤資訊
 */
function isFieldNameImage (req) {
  return req.file.fieldname === 'image'
    ? true
    : {
        errorMessage: 'field key of form should be called "image"!!',
        statusCode: 404
      }
}

/**
 * 判斷request中的file格式是否是image
 *
 * @param {Request} req 請求的資訊
 * @returns {true | ErrorInfo} true或者錯誤資訊
 */
function isImageType (req) {
  return req.file.mimetype.startsWith('image')
    ? true
    : {
        errorMessage: 'file should be image type!!',
        statusCode: 404
      }
}

/**
 * 判斷request中的file大小是否小於1MB
 *
 * @param {Request} req 請求的資訊
 * @returns {true | ErrorInfo} true或者錯誤資訊
 */
function isFileSizeLessThan1MB (req) {
  const mb = 1024 * 1024
  return req.file.size < mb
    ? true
    : {
        errorMessage: 'file must be less than 1MB',
        statusCode: 404
      }
}

/**
 * 判斷request中的file寬度是否大於300px
 *
 * @param {Request} req 請求的資訊
 * @returns {true | ErrorInfo} true或者錯誤資訊
 */
function isImageWidthGreaterThan300 (req) {
  const { minWidth } = req.body
  const { width } = sizeOf(req.file.path)

  if (!minWidth) return true

  return width > minWidth
    ? true
    : {
        errorMessage: 'image width must be greater than 300',
        statusCode: 404
      }
}

/**
 * 判斷request中的file，長寬比是否是1:1
 *
 * @param {Request} req 請求的資訊
 * @returns {true | ErrorInfo} true或者錯誤資訊
 */
function isImage1And1Ratio (req) {
  const { width, height } = sizeOf(req.file.path)
  const { ratio } = req.body

  if (!ratio) return true

  const isRatioStringIncludeColon = ratio.includes(':')
  const isRatioArrayLengthEqualTo2 = ratio.split(':').length === 2
  if (!isRatioStringIncludeColon || !isRatioArrayLengthEqualTo2) {
    return {
      errorMessage: '錯誤的長寬比格式',
      statusCode: 404
    }
  }

  const radioOfWidth = ratio.split(':')[0]
  const radioOfHeight = ratio.split(':')[1]
  if (!radioOfWidth ||
    !radioOfHeight ||
    radioOfWidth === '0' ||
    radioOfHeight === '0'
  ) {
    return {
      errorMessage: '錯誤的長寬比格式',
      statusCode: 404
    }
  }

  if (width / height !== Number(radioOfWidth) / Number(radioOfHeight)) {
    return {
      errorMessage: '長寬比不匹配',
      statusCode: 404
    }
  }

  return true
}

module.exports = {
  isFileExist,
  isFieldNameImage,
  isImageType,
  isFileSizeLessThan1MB,
  isImageWidthGreaterThan300,
  isImage1And1Ratio
}
