const mongoose = require("mongoose")
const bCrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SALT = 10
const config = require("../config/config").get(process.env.NODE_ENV)

const userScheme = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: 1,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 8,
  },

  name: {
    type: String,
    required: false,
    maxLength: 20,
  },

  token: {
    type: String,
    required: false,
  },
})

userScheme.pre("save", function (next) {
  var user = this

  if (!user.isModified("password")) return next()

  bCrypt.genSalt(SALT, function (err, salt) {
    if (err) return next()
    bCrypt.hash(user.password, SALT, (err, hash) => {
      if (err) return next()
      console.log("ededw", user.password)
      user.password = hash
      next()
    })
  })
})

userScheme.methods.comparePassword = function (candidatePassword, cb) {
  var user = this
  bCrypt.compare(candidatePassword, user.password, (err, isMatch) => {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

userScheme.methods.generateToken = function (cb) {
  var user = this

  let token = jwt.sign(user._id.toHexString(), config.SECRET)
  user.token = token

  user.save((err, user) => {
    if (err) return cb(err)
    cb(null, user)
  })
}

userScheme.statics.findByToken = function (token, cb) {
  var user = this
  jwt.verify(token, config.SECRET, (err, decoded) => {
    user.findOne({ _id: decoded, token: token }, (err, user) => {
      if (err) cb(err)
      cb(null, user)
    })
  })
}

userScheme.methods.deleteToken = function (token, cb) {
  var user = this
  user.updateOne({ $unset: { token: 1 } }, (err, user) => {
    if (err) return cb(err)
    cb(null, user)
  })
}

const User = mongoose.model("User", userScheme)

module.exports = { User }
