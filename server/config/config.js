const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.DATABASE_URI
    },

    default: {
        SECRET: 'tinyshynysecret',
        DATABASE: 'mongodb://localhost:27017/TestToDo'
    }
}

exports.get = function get(env) {
    return config[env] || config.default
}