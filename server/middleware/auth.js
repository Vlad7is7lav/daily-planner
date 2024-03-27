const { User } = require("../model/user")

let auth = function (req, res, next) {
  let token = req.cookies.auth
  // User.findByToken({token: token})
  // .then((user) => {
  //   console.log(user)
  //   if (!user) return res.json({ auth: false, data: [] })
  //   console.log("no user")
  //   req.user = user
  //   req.token = token
  //   next()
  // })
  // .catch((err) => {throw err})

  User.findByToken(token, (err, user) => {
    if (err) throw err
    if (!user) return res.json({ auth: false, data: [] })
    console.log(user)
    req.user = user
    req.token = token
    next()
  })
} 

module.exports = { auth }
