require('dotenv').config();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const passport = require('./config/googleAuth');
const fbPassport = require('./config/facebookAuthConfig')
const app = express();
const connectDB = require('./config/dbConnect');
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3500;

connectDB();
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(cookieParser());

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Application running on PORT ${PORT}`))
})

app.use(session({
    secret: process.env.ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use(fbPassport.initialize());
app.use(fbPassport.session());



app.use('/', require('./routes/googleAuthRoute.js'));
app.use("/register", require("./routes/register"));
app.use("/login", require('./routes/auth.js'))
app.use("/refresh", require('./routes/refresh.js'))

app.use("/fb", require('./routes/facebookAuthRoute.js'));