const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        default: '',
        unique: true
    },

    descripcion:{
        type: String
    },

    precio:{
        type: Number,
        required: true
    },

    descuento:{
        type: Number,
        default: 0
    },
    
    imagenes:{
        type: Array
    },
    
    pais:{
        type: String,
        required: true
    }
})

module.exports = model('User', ProductSchema);
