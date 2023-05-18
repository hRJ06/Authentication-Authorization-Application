const express = require('express');
const app = express();
const connect = require('./config/database');

require('dotenv').config();

const PORT = process.env.PORT || 4000;

app.use(express.json());
connect();

const cookieParser = require('cookie-parser');
app.use(cookieParser());


/* Route Import */
const user  = require('./routes/user');
/* Mount Route */
app.use('/api/v1',user);

/* Activate */
app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
})