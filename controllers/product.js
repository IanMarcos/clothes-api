const lookup = require('country-code-lookup')
const Product = require('../models/product');
const { processImgs } = require('../helpers/img-processing');

const createProduct = async(req, res) => {
    let { name, description='', price, discount=0, country } = req.body;
    price = Number(price);
    discount = (Number(discount));
    country = country.toUpperCase();

    if(!name || name.length === 0){
        return res.status(400).json({err: 'Nombre obligatorio'});
    }

    if(!price || isNaN(Number(price))){
        return res.status(400).json({err: 'Precio no valido'});
    }

    if( !country || country.length !== 2 || lookup.byIso(country) === null ){
        return res.status(400).json({err: 'Código de País no valido'});
    }
    
    //Validación de descuento por pais
    const max50 = ['CO', 'MX'];
    const max30 = ['CL', 'PE'];
    if(max50.includes(country) && discount > 50){
        return res.status(400).json({err: 'Descuento muy alto para este país'});
    }
    if(max30.includes(country) && discount > 30){
        return res.status(400).json({err: 'Descuento muy alto para este país'});
    }

    // //Validación de imagenes
    // processImgs(imgs);

    res.status(200).json( {results: req.body});

}

const getProducts = async(req, res) => {
    
    // const { email, password } = req.body;

    // try {
    //     //Validación de la existencia del correo activo en la DB
    //     const user =  await User.findOne({email});
    //     if( !user || !user.active ){
    //         return res.status(401).json({ results:{ err:'Correo o contraseña invalidos'} });
    //     }
    
    //     //Validación de la contraseña
    //     if(! await passwordMatch(password, user.password)){
    //         return res.status(401).json({ results:{ err:'Correo o contraseña invalidos'} });
    //     }
    
    //     //Generación del JWT
    //     const cvToken = generateJWT({uid: user._id, uName: user.name});

    //     const safeUser = {
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email
    //     }
    //     res.status(200).json({results: {cvToken, user:safeUser} });
        
    // } catch (error) {
    //     res.status(500).json({ results: {err: {error} } });
    // }
}

module.exports = {
    createProduct,
    getProducts
};
