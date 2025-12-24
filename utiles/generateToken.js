const jwt = require('jsonwebtoken')

module.exports.generateToken = async (user, res) => {
  // console.log(user);

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1d' })
  console.log(token);

  res.cookie("JWT_Token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  })
  return token

}