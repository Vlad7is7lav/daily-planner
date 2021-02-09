const {User} = require('../model/user');

let auth = function(req, res, next){
    let token = req.cookies.auth;

    User.findByToken(token, (err, user)=>{
        if(err) throw err;
        if(!user) return res.send(false);
        
        req.user = user;
        req.token = token;
        next();
    })
}

module.exports = { auth };