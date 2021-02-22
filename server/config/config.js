const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABSE: process.env.DATABASE
    },

    default: {
        SECRET: 'tinyshynysecret',
        DATABASE: 'mongodb://localhost:27017/TestToDo'
    }
}

exports.get = function get(env) {
    return config[env] || config.default
}