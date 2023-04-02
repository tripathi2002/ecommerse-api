const dotenv = require('dotenv');
dotenv.config({path: './config/.env'});

const connect = require('./database/conn');
const app = require('./app');

const { PORT, IP } = process.env;

connect().then(()=>{
    try{
        app.listen(PORT, IP, ()=>{
            console.log(`server started on http://${IP}:${PORT}`);
        });       
    }catch(error){
        console.log("Server not started!");
    }
}).catch(_=>{
    console.log("Error in database connection!");
});