const express = require("express")
const router = express.Router()

//Model
const { User } = require("../model/user")

//Middleware
const { auth } = require("../middleware/auth")

////
router.post("/register", function (req, res, next) {
  const user = new User(req.body)
  user
    .save()
    .then((doc) => {
      res.status(200).json({ success: true, user: doc })
    })
    .catch((err) => next(err))
  // user.save((err, doc) => {
  //   if (err) {
  //     next(err)
  //   } else {
  //     res.status(200).json({ success: true, user: doc })
  //   }
  // })
})

// router.post("/login", function (req, res) {
//   User.findOne({ email: req.body.email }, (err, user) => {
//     if (err) return res.json({ err: err })
//     if (!user)
//       res.json({
//         auth: false,
//         message: "User not found",
//         userData: false,
//       })

//     user.comparePassword(req.body.password, (err, isMatch) => {
//       if (!isMatch)
//         return res.json({
//           auth: false,
//           message: "Wrong password",
//           userData: false,
//         })

//       user.generateToken((err, user) => {
//         if (err) return res.status(400).send(err)
//         res.cookie("auth", user.token).json({
//           auth: true,
//           message: "ok",
//           userData: {
//             id: user._id,
//             email: user.email,
//             name: user.name,
//           },
//         })
//       })
//     })
//   })
// })

router.post("/login", function (req, res) {
  User.findOne({ email: req.body.email })
  .then((user) => {
    if (!user)
      res.json({
        auth: false,
        message: "User not found",
        userData: false,
      })

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          auth: false,
          message: "Wrong password",
          userData: false,
        })

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err)
        res.cookie("auth", user.token).json({
          auth: true, 
          message: "ok",
          userData: {
            id: user._id,
            email: user.email,
            name: user.name,
          },
        })
      })
    })
  })
  .catch((err) => {
    if (err) return res.json({ err: err })
  })
})

//   .exec((err, user) => {
//     if (err) return res.json({ err: err })
//     if (!user)
//       res.json({
//         auth: false,
//         message: "User not found",
//         userData: false,
//       })

//     user.comparePassword(req.body.password, (err, isMatch) => {
//       if (!isMatch)
//         return res.json({
//           auth: false,
//           message: "Wrong password",
//           userData: false,
//         })

//       user.generateToken((err, user) => {
//         if (err) return res.status(400).send(err)
//         res.cookie("auth", user.token).json({
//           auth: true,
//           message: "ok",
//           userData: {
//             id: user._id,
//             email: user.email,
//             name: user.name,
//           },
//         })
//       })
//     })
//   })
// })

router.get("/auth", auth, function (req, res) {
  res.json({
    auth: true,
    userData: {
      id: req.user._id,
      email: req.user.email,
    },
  })
})

router.get("/logout", auth, function (req, res) {
  req.user.deleteToken(req.token, (err, user) => {
    if (err) return res.status(400).send(err)
    res.status(200).cookie("auth", "").json({
      auth: false,
      logout: true,
    })
  })
})

router.patch("/update", auth, function (req, res) {
  User.findByIdAndUpdate(
    req.body.userData.id,
    req.body.userData,
    { new: true },
    (err, doc) => {
      if (err) return res.status(400).send(err)
      res.json({
        auth: true,
        success: true,
        userData: doc,
      })
    }
  )
})

module.exports = router
