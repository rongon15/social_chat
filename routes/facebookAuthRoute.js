const express = require("express");
const router = express.Router();
const passport = require("../config/facebookAuthConfig");

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/index'})),
function (req, res){
    console.log("Facebook Access Token: ",res.user.tokens.facebook.accessToken)
}

module.exports = router;



