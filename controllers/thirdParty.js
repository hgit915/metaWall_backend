const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { generateUrlJWT } = require('../service/auth')

const googleSignIn = async (req, res, next) => {
  const { sub, name, picture, email } = req.user

  req.thirdParty = { provider: 'google', keyInUserSchema: 'googleId', id: sub }
  req.user = { name, email, photo: picture }

  await thirdPartySignin(req, res, next)
}

const facebookSignIn = async (req, res, next) => {
  console.log(req.user)
  const { id, name, photos, email } = req.user

  req.thirdParty = { provider: 'google', keyInUserSchema: 'googleId', id }
  req.user = { name, email, photo: photos }

  await thirdPartySignin(req, res, next)
}

async function thirdPartySignin (req, res, next) {
  const { email } = req.user
  const { id, keyInUserSchema } = req.thirdParty

  const user = await User.findOne({ email })
  const userHaveThirdPartyId = await User.findOne({ email, [keyInUserSchema]: id })

  if (user && !userHaveThirdPartyId) {
    return res.redirect(`${process.env.FONTEND_URL}/oauth?error=${encodeURIComponent('email已被註冊，請替換新的email')}`)
  }

  if (userHaveThirdPartyId) {
    return generateUrlJWT(res, user)
  }

  const password = await bcrypt.hash(id, 12)
  const newUser = await User.create({
    ...req.user,
    password
  })
  return generateUrlJWT(res, newUser)
}

module.exports = {
  googleSignIn,
  facebookSignIn
}
