/**
 * 錯誤資訊
 *
 * @typedef {Object} ErrorInfo
 * @property {string} errorMessage - 錯誤訊息
 * @property {string} statusCode - 狀態碼
 */

/**
 * blocker function格式
 *
 * @callback BlockerFunc
 * @param {Request} req
 * @returns {true | ErrorInfo}
 */
