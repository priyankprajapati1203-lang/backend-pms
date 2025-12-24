const jwt = require('jsonwebtoken')

module.exports.protect = (req, res, next) => {
  try {
    let token
    // console.log(req.cookies);

    token = req.cookies.JWT_Token
    // console.log(token);

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });

    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }
}