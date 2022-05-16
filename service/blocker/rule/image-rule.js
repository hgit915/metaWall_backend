const sizeOf = require('image-size')
/**
 *
 * - 規則說明
 *
 * 底下所創建的rule function用來驗證東西是否正確
 * 驗證若正確，回傳true
 * 若不正確，回傳格式為
 * {
 *    errorMessage: string,
 *    statusCode: number | string
 * }
 *
 */

function isFileExist (req) {
  return req.file
    ? true
    : {
        errorMessage: 'file required!!',
        statusCode: 404
      }
}

function isFieldNameImage (req) {
  return req.file.fieldname === 'image'
    ? true
    : {
        errorMessage: 'field key of form should be called "image"!!',
        statusCode: 404
      }
}

function isImageType (req) {
  return req.file.mimetype.startsWith('image')
    ? true
    : {
        errorMessage: 'file should be image type!!',
        statusCode: 404
      }
}

function isFileSizeLessThan1MB (req) {
  const mb = 1024 * 1024
  return req.file.size < mb
    ? true
    : {
        errorMessage: 'file must be less than 1MB',
        statusCode: 404
      }
}

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
