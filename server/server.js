const express = require("express")
const bodyParser = require("body-parser")
const coockieParser = require("cookie-parser")
const cors = require("cors");
const app = express()
const dotenv = require('dotenv');

var corsOptions = {
  origin: "http://localhost:3003"
};

app.use(cors(corsOptions));

const mongoose = require("mongoose")
const config = require("./config/config").get(process.env.NODE_ENV)
var fs = require("fs")

const userRoute = require("./routes/userRoutes")
const listRoute = require("./routes/listRoutes")

const path = require("path")

//MIDDLEWARE
app.use(express.json())
app.use(coockieParser())
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

app.use("/user", userRoute)
app.use("/lists", listRoute)
app.use(express.static(path.resolve(__dirname, "..", "dist")))

if (process.env.NODE_ENV === "production") {
  app.get("/", (req, res) => {
    console.log("Works")
    res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"))
  })
}

console.log(path.resolve(__dirname, "..", "dist", "index.html"))
app.use((err, req, res, next) => {
  if (err.code === 11000) return res.json({ reg: false, message: "duplicate" })

  res.status(500).json({ error: err.stack })
})

// mongoose.connect(config.DATABASE, {
mongoose.connect("mongodb://localhost:27017/TestToDo")
// mongoose.connect("mongodb+srv://admin_user:VvClpZJKf1vj1yxr@cluster0.mtymc2u.mongodb.net/?retryWrites=true&w=majority")

const port = process.env.PORT || 3003

app.listen(port, () => {
  console.log(`Server is started in port: ${port}`)
})
