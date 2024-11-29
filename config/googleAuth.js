require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3500/auth/google/callback",
    passReqToCallback   : true
  },
  async (request, accessToken, refreshToken, profile, done) => {
    try{
      let user = await User.findOne({ $or: [{ googleId: profile.id }, { email: profile.email }] });
      if (!user) {
        const rToken = jwt.sign({"username": profile.email}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '5d'});
        console.log("Creating new user...");
        user = new User({
          googleId: profile.id,
          firstname: profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
          refreshToken: rToken
        });
        try{
          await user.save();
          console.log("User saved to MongoDB:", user);
        }
        catch(error){
          console.log("Error saving user:", error.message);
          return done(error, null);
        }
    }
    return done(null,user);
  } catch (err) {
    return done(err, null);
  }
}
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;