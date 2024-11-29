const mongoose = require('mongoose')
const schema = mongoose.Schema

const UserSchema = new schema({
    googleId: {
        type:String,
        required: false
    },
    facebookId: {
        type: String,
        required: false
    },
    firstname:{
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: { type: String, required: function() { return !this.googleId; } 
    },
    tokens: {
        facebook: {
            accessToken: {
                type: String,
                required: false
            },
            refreshToken: {
                type: String,
                required: false
            }
        }
    },
    refreshToken: String
});

module.exports = mongoose.model("users", UserSchema);
