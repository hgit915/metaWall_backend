const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/users')

module.exports = (passport) => {
  // Facebook 登入
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']
      },
      (accessToken, refreshToken, profile, done) => {
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
    )
  )

  // Google 登入
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGL_CALLBACK,
        profileFields: ['email', 'displayName']
      },
      (accessToken, refreshToken, profile, done) => {
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
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
