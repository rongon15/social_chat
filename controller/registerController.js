const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User')

const handleRegistration = async (req,res) => {
    const {firstname, lastname, email, password} = req.body;
    if(!email || !password) return res.status(400).json({"message": "email and password must be filled"});
    const duplicate = await User.findOne({email: email}).exec();
    if (duplicate) return res.status(409).json({"message": "User is already registered"});
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create({
            "firstname": firstname,
            "lastname": lastname,
            "email" : email,
            "password": hashedPassword
        })
        console.log(result);
        res.status(200).json({"message" : `User ${firstname} created successfully`});
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}

module.exports = { handleRegistration };