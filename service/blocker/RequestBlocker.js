require('./rule/types/type')
/**
 * 請求阻擋者。可注入多個條件判斷的驗證function，
 * 藉此取得當前錯誤的資訊
 *
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

  /**
   * 設置想要的阻擋 function
   *
   * @param {BlockerFunc[]} blockers 多個blocker function
   * @returns {RequestBlocker} RequestBlocker實例
   */
  setBlocker (...blocker) {
    this.strategyList.push(...blocker)
    return this
  }

  /**
   * 依序驗證blocker function後，取得當前被阻擋的錯誤資訊。沒有的話取得null
   *
   * @returns {null | ErrorInfo} 回傳null或者錯誤資訊
   */
  getErrorData () {
    for (const blockerFunc of this.strategyList) {
      const trueOrErrorData = blockerFunc(this.request)
      if (trueOrErrorData !== true) return trueOrErrorData
    }

    return null
  }

  /**
   * 依序驗證blocker function後，取得當前被阻擋的錯誤資訊。沒有的話取得null
   * 此為async版本，會還傳Promise
   *
   * @returns {Promise<null | ErrorInfo>} 回傳null或者錯誤資訊
   */
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
