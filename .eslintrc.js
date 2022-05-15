module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'linebreak-style': 0 // 這個用來擋掉說一定要LF換行，阿我windows就是CRLF阿
  }
}
