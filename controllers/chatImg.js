const chatImg = require('../models/chatImg')
const handleSuccess = require('../service/handleSuccess')

module.exports = {
  getImgs: async (req, res) => {
    const result = await chatImg.find()
    handleSuccess(res, '資料讀取成功', result)
  }
}
