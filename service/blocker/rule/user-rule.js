const validator = require('validator')
const User = require('../../../models/user')

/** 判斷name、email、password欄位是否都有填值 */
function haveNameEmailPassword (req) {
  const { email, password, name } = req.body
  return email && password && name
    ? true
    : {
        errorMessage: '欄位未填寫正確',
        statusCode: 400
      }
}

/** 判斷email格式是否正確 */
function isEmailCorrectFormat (req) {
  return validator.isEmail(req.body.email)
    ? true
    : {
        errorMessage: 'Email 格式不正確',
        statusCode: 400
      }
}

/** 判斷email是否沒有被註冊過 */
async function isEmailHasntBeenRegistered (req) {
  const user = await User.findOne({ email: req.body.email })
  return !user
    ? true
    : {
        errorMessage: '帳號已被註冊，請替換新的 Email！',
        statusCode: 400
      }
}

/** 判斷name是否大於2個字元 */
function isNameLengthGreaterThanTwo (req) {
  return validator.isLength(req.body.name, { min: 2 })
    ? true
    : {
        errorMessage: '暱稱至少 2 個字元以上',
        statusCode: 400
      }
}

/** 判斷password是否大於8個字元 */
function isPasswordLengthGreaterThanEight (req) {
  return validator.isLength(req.body.password, { min: 8 })
    ? true
    : {
        errorMessage: '密碼需至少 8 碼以上，並中英混合',
        statusCode: 400
      }
}

/** 判斷有name的情況，name是否大於2個字元 */
function hasNameAndNameLengthGreaterThanTwo (req) {
  return !req.body.name
    ? true
    : isNameLengthGreaterThanTwo(req)
}

/** 判斷有gender的情況，該值符合可寫入資料庫的格式 */
function hadGenderAndValueValid (req) {
  const { gender } = req.body
  console.log(gender)
  return !gender
    ? true
    : gender === 'male' || gender === 'female'
      ? true
      : {
          errorMessage: '性別帶入值不正確',
          statusCode: 400
        }
}

module.exports = {
  haveNameEmailPassword,
  isEmailCorrectFormat,
  isEmailHasntBeenRegistered,
  isNameLengthGreaterThanTwo,
  isPasswordLengthGreaterThanEight,
  hasNameAndNameLengthGreaterThanTwo,
  hadGenderAndValueValid
}
