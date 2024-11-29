const jwt = require('jsonwebtoken');
const User = require('../models/User')
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeaders = req.authHeaders;
    if(!authHeaders) return res.sendStatus(401);
    console.log(authHeaders);
    const bearerToken = authHeaders.split(" ")[1];
    jwt.verify(
        bearerToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403);
            req.email = decoded.email;
            const user = User.findOne({email: decoded.email});
            if(!user) {return res.sendStatus(404)};
            req.user = user;
            next();
        }
    )
}

module.exports = verifyToken;