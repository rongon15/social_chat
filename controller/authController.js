const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleAuth =async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({"message": "Please enter email and password"});
    const foundUser = await User.findOne({email: email}).exec();
    if(!foundUser) return res.status(400).json({"message":"User doesn't exist"});

    const match = await bcrypt.compare(password, foundUser.password);
    if(match){
        const accessToken = jwt.sign({
            "username" : foundUser.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '1d'}
    );
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '5d'}
        );
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt',refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
        res.json({accessToken});
    }
    else{
        res.sendStatus(401);
    }
}

module.exports = {handleAuth};