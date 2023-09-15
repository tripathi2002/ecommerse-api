const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('./routes/auth.route');
const productRouter = require('./routes/product.route');
const blogRouter = require('./routes/blog.route');
const brandRouter = require('./routes/brand.route');
const couponRouter = require('./routes/coupon.route');
const cartRouter = require('./routes/cart.route');
const orderRouter = require('./routes/order.route');

const productCategoryRouter = require('./routes/product.category.route');
const blogCategoryRouter = require('./routes/blog.category.route');

const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'));

app.get('/', (req,res)=>{
    res.send("### Jai Shree Ram ###");
});

app.use('/v3/api/user', authRouter);
app.use('/v3/api/product', productRouter);
app.use('/v3/api/blog', blogRouter);
app.use('/v3/api/brand', brandRouter);
app.use('/v3/api/coupon', couponRouter);

app.use('/v3/api/category/product', productCategoryRouter);
app.use('/v3/api/category/blog', blogCategoryRouter);

app.use('/v3/api/cart', cartRouter);
app.use('/v3/api/order', orderRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;