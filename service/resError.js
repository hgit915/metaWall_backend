const resError = {
  resErrorProd (err, res) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        message: err.message
      })
    } else {
      // log 紀錄
      console.error('出現重大錯誤', err)
      // 送出罐頭預設訊息
      res.status(500).json({
        status: 'error',
        message: '系統錯誤，請恰系統管理員'
      })
    }
  },
  // 開發環境錯誤
  resErrorDev (err, res) {
    // 之後再統整錯誤的資訊 ~
    if (err.message?.includes('Cast to ObjectId failed')) {
      err.message = '錯誤的id!!'
    }
    res.status(err.statusCode).json({
      message: err.message,
      error: err,
      stack: err.stack
    })
  }
}

module.exports = resError
