const mongoose = require('mongoose');

// const conn = mongoose.createConnection(process.env.MONGODB_URI);

connect = async () => {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected Successfully...!");
// return db;
}

module.exports = connect;