require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/User');
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    config_id: process.env.FACEBOOK_CONFIG_ID,
    callbackURL: "http://localhost:3500/fb/auth/facebook/callback",
    passReqToCallback: true
},
async (req, accessToken, refreshToken, profile, cb) => {
    try{
        const token = req.cookies.accessToken;
        if(!token){
            console.log("No token provided");
            return cb(new Error("No token provided"), null);
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded Token:", decoded);
        const loggedInUser = await User.findOne({email: decoded.username});
        console.log("Queried User:", loggedInUser);
        if (!loggedInUser){
            console.log("No logged-in user found.");
            return cb(new Error("No logged-in user"), null);
        }
        console.log("Logged-in user before update:", loggedInUser);

        loggedInUser.facebookId = profile.id;
        loggedInUser.tokens.facebook = {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
        await loggedInUser.save();
        console.log("Facebook credentials added to the logged-in user.");
        return cb(null, loggedInUser);
    }
    catch(error){
        console.log("Error adding facebook data", error);
        return cb(error, null);
    }
}

))

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });

  module.exports = passport;