const User = require('../models/user')
const bcrypt = require('bcryptjs')

const checkUser = (accessToken, refreshToken, profile, done) => {
  // find and create user
  User.findOne({
    email: profile._json.email
  }).then((user) => {
    // 如果 email 不存在就建立新的使用者
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8)
      bcrypt.genSalt(12, (_err, salt) =>
        bcrypt.hash(randomPassword, salt, (_err, hash) => {
          const newUser = User({
            name: profile._json.name,
            email: profile._json.email,
            password: hash
          })
          newUser
            .save()
            .then((user) => {
              return done(null, user)
            })
            .catch((err) => {
              console.log(err)
            })
        })
      )
    } else {
      return done(null, user)
    }
  })
}

module.exports = checkUser
