const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { cleanOldFiles } = require('../config/file-system');

const app = express();
const paths = {
    products:'/api/products'
};

connectDB();
middlewares();
routes();
cleanOldFiles('uploads');

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_CNN);
    } catch(err){
        console.log(err);
        throw new Error('Error en la conexión a la DB');
    }
}

function middlewares() {
    app.use(cors());

    //Lectura y Parsing de body
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
}

function routes() {
    app.use(paths.products, require('../routes/products'));
}

module.exports = app;
