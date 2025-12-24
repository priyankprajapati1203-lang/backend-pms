module.exports.authRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "Not Authorized" })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allow for this!" })
    }
    next()
  }
}