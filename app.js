const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const router = require('./routes/auth.route');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('short'));

app.get('/', (req,res)=>{
    res.send("bye");
});

app.use('/api/user', router);

app.use(notFound);
app.use(errorHandler)

module.exports = app;