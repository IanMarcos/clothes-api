const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const lookup = require('country-code-lookup')
const Product = require('../models/product');
const { getFormat, processImgs } = require('../helpers/img-processing');

const createProduct = async(req, res) => {
    let { name, description='', price, discount=0, country } = req.body;
    const files = req.files;

    price = Number(price);
    discount = Number(discount);
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
    const validFormats = ['jpeg', 'jpg', 'png', 'webp'];
    files.forEach(file => {
        if(!validFormats.includes( getFormat(file.mimetype) )){
            return res.status(400).json({err: 'Formato inadecuado de archivos'});
        }
    });

    //Procesamiento de imagenes en caso de que alguna pese más de 1MB
    const proccessedImgData = await processImgs(files);
    //Si algun elemento es null hubo algún fallo procesando las imagenes
    if (proccessedImgData.includes(null)){
        return res.status(500).json({ err: 'Error inseperado procesando las imagenes' });
    }

    //Se verifica que ninguna imagen haya quedado de más de !MB
    proccessedImgData.forEach(data => {
        if(data.size >= 1000000){
            return res.status(400).json({ err: 'Alguna imagen es demasiado grande' });
        }
    });

    //Sea almacenan las imagenes en imgBB
    //Array de promises
    const promises = files.map( file => {
        const url = "https://api.imgbb.com/1/upload?key=582dabb88b61248f8c2ff52fd47ede95"
        const data = new FormData();
        data.append('image',fs.createReadStream(file.path));
        return axios.post(url, data, {
            headers: data.getHeaders()
        })
        
    })
    
    const responses = await Promise.all(promises);
    // console.log(responses);
    // responses.forEach(response => {})

    res.status(200).json( {results: 'Hi'});

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
