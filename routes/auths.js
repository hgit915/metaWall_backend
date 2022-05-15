const express = require('express')
const router = express.Router()
const passport = require('passport')
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
)
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/sign_in' }),
  (req, res) => {
    res.redirect('/posts')
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
    res.redirect('/posts')
  }
)
module.exports = router
