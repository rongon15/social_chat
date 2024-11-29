const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = dbConnect