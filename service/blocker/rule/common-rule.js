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
