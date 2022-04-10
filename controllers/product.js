const Product = require('../models/product');
const { round } = require('../helpers/math');
const { saveImgToHosting } = require('../helpers/img-saving');

const createProduct = async(req, res) => {
    //Se almacenan las imagenes en imgBB
    const images = await saveImgToHosting(req.files);
    if(!images) return res.status(500).json( {err: 'Error al guardar imágenes', status:500});
    
    //Se guarda el producto en mongo
    const { schema } = req;
    schema.images = images;
    const product = new Product(schema);

    try {
        const newProduct = await product.save();
        return res.status(201).json({ results: {product:newProduct}, status: 201 });
    } catch (error) {
        return res.status(500).json({ err: {error}, status:500, msg: 'Fallo la conexion a la BD' });
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
        res.status(500).json( {results: {err:'Fallo en la conexión a la DB'}, status:500} );
    }
}

module.exports = {
    createProduct,
    getProducts
};
