require('./types/type')

/**
 * 判斷當前傳遞的多個參數中，至少要有一個存在或者有值
 *
 * @param {any}  請求的資訊
 * @returns {true | ErrorInfo} true或者錯誤資訊
 */
function atLeastOneRequired (...data) {
  return () => [...data].find(item => item)
    ? true
    : {
        errorMessage: '需至少填寫一項',
        statusCode: 400
      }
}

module.exports = {
  atLeastOneRequired
}
