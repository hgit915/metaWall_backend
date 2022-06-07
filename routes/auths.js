const express = require('express')
const router = express.Router()
const passport = require('passport')
const handleErrorAsync = require('../service/handleErrorAsync')
const ThirdPartyController = require('../controllers/thirdParty')

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
)

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/sign_in' }),
  handleErrorAsync(ThirdPartyController.facebookSignIn)
)

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

router.get(
  '/google/redirect',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/sign_in'
  }),
  handleErrorAsync(ThirdPartyController.googleSignIn)
)

module.exports = router
