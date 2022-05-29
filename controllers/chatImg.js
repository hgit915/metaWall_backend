const chatImg = require('../models/chatImg')
const handleSuccess = require('../service/handleSuccess')
const handleErrorAsync = require('../service/handleErrorAsync')

module.exports = {
  getImgs: handleErrorAsync(async (req, res) => {
    const result = await chatImg.find()
    handleSuccess(res, '資料讀取成功', result)
  })
}
