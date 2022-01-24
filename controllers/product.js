const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const Product = require('../models/product');
const { deleteDirContents } = require('../helpers/file-system');
const { round, validateFields, validateFiles } = require('../helpers/field-validators');

const createProduct = async(req, res) => {
    
    //Validación de campos de texto
    const schema = validateFields({req, res});
    if(schema.err) {
        deleteDirContents('uploads');
        return;
    }
    
    // //Validación de imagenes
    const files = req.files;
    const validFiles = validateFiles({files, res});
    if(!validFiles) {
        deleteDirContents('uploads');
        return;
    }

    //Se almacenan las imagenes en imgBB

    //Array de promises
    const posts = files.map( file => {
        const url = "https://api.imgbb.com/1/upload?key=582dabb88b61248f8c2ff52fd47ede95"
        const data = new FormData();
        data.append('image',fs.createReadStream(file.path));
        
        return axios.post(url, data, {
            headers: data.getHeaders()
        }); 
    });

    const images = [];
    try {
        const responses = await Promise.all(posts);

        responses.forEach(({status, data:{data: {url}}}) => {
            if(status !== 200){
                deleteDirContents('uploads');
                return res.status(500).json( {err: 'Error al guardar imágenes'});
            }
            images.push(url);
        });
    } catch (error) {
        deleteDirContents('uploads');
        return res.status(400).json( {err: 'Problema con las imagenes subidas'});
    }

    

    //Se eliminan las imagenes del servidor
    deleteDirContents('uploads');

    //Se guarda el producto en mongo
    schema.images = images;
    const product = new Product(schema);

    try {
        //Guarda y retorna el usaurio sin la propiedad '__v'
        const results = await product.save();
        return res.status(201).json({ results: {status: 200, product:results} });
    } catch (error) {
         return res.status(500).json({ err: {error}, results: product, msg: 'Fallo la conexion a la BD' });
    }

}

const getProducts = async(req, res) => {
    let { limit = 10, page = 1 } = req.query;

    limit = Number(limit);
    page = Number(page);

    if(isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0){
        limit=10;
        page=1;
    }

    if(page > 0) page -=1;

    try {
        const products = await Product.find()
            .select('-_id -description -country -__v')
            .skip( page * limit)
            .limit(limit)
            .lean().exec();     //Estos devuelven products como un objeto de js

        products.forEach(product => {
            const { price, discount} = product
            product.discountPrice = round(price * (1-(discount*0.01)), 2);
        })

        res.status(200).json( {results: {products}, status:200} );
    } catch (error) {
        res.status(500).json( {results: {err:'Fallo en la conexión a la DB'}} );
    }
}

module.exports = {
    createProduct,
    getProducts
};
