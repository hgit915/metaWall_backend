const express = require('express')
const router = express.Router()
const passport = require('passport')
const { generateUrlJWT } = require('../service/auth')

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
)
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/sign_in' }),
  (req, res) => {
    const user = req.user
    generateUrlJWT(res, user)
  }
)

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

router.get(
  '/google/redirect',
  passport.authenticate('google', { failureRedirect: '/sign_in' }),
  (req, res) => {
    const user = req.user
    generateUrlJWT(res, user)
  }
)

module.exports = router
