const lookup = require('country-code-lookup');
const { getFormat, processImgs } = require('../helpers/img-processing');
const { round } = require('../helpers/math');

function validateFields( req, res, next ) {

    let { name, description = '', price, discount = 0, country } = req.body;
    discount = Number(discount);
    const err = [];

    if(!name || name.length === 0 || name.length > 50){
        err.push('Nombre invalido');
    }

    if(description.length > 100){
        err.push('Descripción demasiado larga');
    }

    if(isNaN(discount) || discount < 0 || discount > 100){
        err.push('Descuento no valido');
    }

    if(price) {
        price = Number(price);
        if(isNaN(price) || price < 0){
            err.push('Precio no valido');
        }
    } else err.push('Precio no incluido');

    if(country) {
        country = country.toUpperCase();
        if(country.length !== 2 || lookup.byIso(country) === null){
            err.push('Código de País no valido');
        }
    } else err.push('País no incluido');

    //Formato del precio a dos decimales
    if(price % 1 !== 0){
        price = round(price, 2);
    }

    //Validación de descuento por pais
    const max50 = ['CO', 'MX'];
    const max30 = ['CL', 'PE'];
    if(max50.includes(country) && discount > 50){
        err.push('Descuento muy alto para este país');
    }
    if(max30.includes(country) && discount > 30){
        err.push('Descuento muy alto para este país');
    }
 
    if(err.length > 0){
        return res.status(400).json({err, status:400});
    }

    //Se almacenan los datos validados y en el correcto formato en el request
    req.schema = {name, description, price, discount, country};

    next();
}

async function validateFiles( req, res, next ){
    if(req.files.length < 2 || req.files.length > 5){
        return res.status(400).json({err:'Cantidad de imágenes no aceptada', status:400});
    }

    //Se corrige el path en caso de que incluya //
    req.files.forEach(file => {
        if(file.path.includes('\\')){
            file.path = file.path.replace('\\', '/');
        }
    });
    
    const {files} = req;
    const validFormats = ['jpeg', 'jpg', 'png', 'webp'];

    if( files.some(file => !validFormats.includes( getFormat(file.mimetype) ))){
        return res.status(400).json({err:'Formato inadecuado de archivos', status:400});
    }


    //Procesamiento de imagenes en caso de que alguna pese más de 1MB
    const proccessedImgData = await processImgs(files);

    //Si algun elemento es null hubo algún fallo procesando las imagenes
    if (proccessedImgData.includes(null)){
        return res.status(500).json({err:'Error inseperado procesando las imagenes', status:500});
    }

    //Se verifica que ninguna imagen haya quedado de más de 1MB
    if(proccessedImgData.some(img => img.size >= 1000000)){
        return res.status(400).json({err:'Alguna imagen es demasiado grande', status:400});
    }

    next();
}


module.exports = {
    validateFields,
    validateFiles
};
