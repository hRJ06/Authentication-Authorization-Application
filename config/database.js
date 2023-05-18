const mongoose = require('mongoose');
require('dotenv').config();

const connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {console.log('Connected to Database')})
    .catch((err) => {
        console.log('Failed to connect to Database');
        console.error(err);
        process.exit(1);
    })
}
module.exports = connect;