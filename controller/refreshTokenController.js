const jwt = require('jsonwebtoken');
const User = require('../models/User');

const handleRefresh = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt
    const foundUser = User.findOne({refreshToken}).exec();
    if(!foundUser) return res.sendStatus(403);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.email !==decoded.email) 
            {
                return res.sendStatus(403);
            }
            const accessToken = jwt.sign(
                {"email" : decoded.email},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '1d'}
            );
            res.json({accessToken});
        }
    )
}

module.exports = {handleRefresh}