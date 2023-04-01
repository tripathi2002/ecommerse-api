const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/auth.route');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req,res)=>{
    res.send("bye");
});

app.use('/api/user', router);

app.use(notFound);
app.use(errorHandler)

module.exports = app;