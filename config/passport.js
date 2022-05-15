const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy
const checkUser = require('../helpers/checkUser')
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
      checkUser
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
      checkUser
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
