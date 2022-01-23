const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: '',
        unique: true
    },

    description:{
        type: String
    },

    price:{
        type: Number,
        required: true
    },

    discount:{
        type: Number,
        default: 0
    },
    
    images:{
        type: Array,
        required:true
    },
    
    country:{
        type: String,
        required: true
    }
})

module.exports = model('User', ProductSchema);
