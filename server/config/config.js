const dotenv = require('dotenv');
const config = {
  production: {
    SECRET: process.env.SECRET,
    DATABASE: dotenv.config().parsed.DATABASE_URI,
    // SECRET: process.env.SECRET,
    // DATABASE: process.env.DATABASE_URI,
  },

  default: {
    SECRET: "tinyshynysecret",
    DATABASE: "mongodb://localhost:27017/TestToDo",
  },
}

exports.get = function get(env) {
  return config[env] || config.default
}
