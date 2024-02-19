const config = {
  production: {
    SECRET: process.env.SECRET,
    DATABASE: "mongodb+srv://admin_user:VvClpZJKf1vj1yxr@cluster0.mtymc2u.mongodb.net/?retryWrites=true&w=majority",
  },

  default: {
    SECRET: "tinyshynysecret",
    DATABASE: "mongodb://localhost:27017/TestToDo",
  },
}

exports.get = function get(env) {
  return config[env] || config.default
}
