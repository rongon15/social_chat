const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../config/googleAuth'); 

const router = express.Router();

// Route to initiate Google login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

// Google callback route
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    const accessToken = jwt.sign({"username":req.user.email }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
    res.cookie('refreshToken', req.user.refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
    res.cookie('accessToken', accessToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
    console.log("Authentication successful, redirecting...");
    res.redirect('/index');
  }
);

module.exports = router;