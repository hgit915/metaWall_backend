const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy

module.exports = (passport) => {
  // Facebook 登入
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName', 'id']
      },
      (accessToken, refreshToken, profile, cb) => {
        return cb(null, profile._json)
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
      (accessToken, refreshToken, profile, cb) => {
        return cb(null, profile._json)
      }
    )
  )
}
