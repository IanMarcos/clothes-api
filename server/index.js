const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

class Server {

    constructor(){
        //Variables de clase
        this.port = process.env.PORT;
        this.paths = {
            products:'/api/products'
        };

        //Creación del servidor de express con socket.io
        this.app = express();

        this.connectDB();
        this.middlewares();
        this.routes();
    }

    async connectDB(){
        try{
            await mongoose.connect(process.env.MONGODB_CNN);
        } catch(err){
            console.log(err);
            throw new Error('Error en la conexión a la DB');
        }
    }

    middlewares() {
        this.app.use(cors());

        //Lectura y Parsing de body
        this.app.use( express.json() );
    }

    routes() {
        this.app.use(this.paths.products, require('../routes/products'));
    }

    init() {
        this.app.listen(this.port);
    }
}

module.exports = Server;
