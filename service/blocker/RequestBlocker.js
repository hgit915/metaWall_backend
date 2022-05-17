/**
 * @example
 * function postController(req, res, next) {
    const errorData = new RequestBlocker(req)
      .setBlocker(
        isFileExist, // 自定義驗證錯誤function，可參考image-rule.js
        isFieldNameImage,
      ).getErrorData();

    if (errorData) {
      const { statusCode, errorMessage } = errorData;
      return appError(statusCode, errorMessage, next);
    }
    ...

  如果setBlocker中帶入的驗證function有"非同步的"，需要在new之前加上await，並且更改為使用getErrorDataAsync方法
  async function postController(req, res, next) {
    const errorData = await new RequestBlocker(req)
      .setBlocker(
        isFileExistAsync, // async function
        isFieldNameImage,
      ).getErrorDataAsync();

    if (errorData) {
      const { statusCode, errorMessage } = errorData;
      return appError(statusCode, errorMessage, next);
    }
    ...
 */
class RequestBlocker {
  constructor (request) {
    this.request = request
    this.strategyList = []
  }

  setBlocker (...blocker) {
    this.strategyList.push(...blocker)
    return this
  }

  getErrorData () {
    for (const blockerFunc of this.strategyList) {
      const trueOrErrorData = blockerFunc(this.request)
      if (trueOrErrorData !== true) return trueOrErrorData
    }

    return null
  }

  async getErrorDataAsync () {
    for (const blockerFunc of this.strategyList) {
      const result = blockerFunc(this.request)
      if (isPromise(result)) {
        const innerResult = await newPromise(result)
        if (innerResult !== true) return innerResult
      } else if (result !== true) return result
    }

    return null
  }
}

function isPromise (data) {
  return typeof data.catch === 'function' &&
  data[Symbol.toStringTag] === 'Promise'
}

function newPromise (promise) {
  return new Promise((resolve, reject) => {
    promise.then((data) => {
      resolve(data)
    })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = RequestBlocker
