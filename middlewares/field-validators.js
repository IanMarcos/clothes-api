const lookup = require('country-code-lookup');
const { getFormat, processImgs } = require('../helpers/img-processing');
const { round } = require('../helpers/math');
const { deleteDirContents } = require('../helpers/file-system');

function validateFields( req, res, next ) {

    let { name, description='', price, discount=0, country } = req.body;
    price = Number(price);
    discount = Number(discount);
    country = country.toUpperCase();

    const err = [];

    if(!name || name.length === 0 || name.length > 50){
        err.push('Nombre invalido');
    }

    if(description.length > 100){
        err.push('Descripción demasiado larga');
    }

    if(!price || isNaN(price) || price < 0){
        err.push('Precio no valido');
    }

    if(discount <0 || discount>100){
        err.push('Descuento no valido');
    }

    if( !country || country.length !== 2 || lookup.byIso(country) === null ){
        err.push('Código de País no valido');
    }

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
        deleteDirContents('uploads');
        return res.status(400).json({err});
    }

    //Se almacenan los datos validados y en el correcto formato en el request
    req.schema = {name, description, price, discount, country};

    next();
}

async function validateFiles( req, res, next ){
    //Se corrige el path en caso de que incluya //
    req.files.forEach(file => {
        if(file.path.includes('\\')){
            file.path = file.path.replace('\\', '/');
        }
    });
    
    const {files} = req;
    const validFormats = ['jpeg', 'jpg', 'png', 'webp'];

    if( files.some(file => !validFormats.includes( getFormat(file.mimetype) ))){
        deleteDirContents('uploads');
        return res.status(400).json({err:'Formato inadecuado de archivos'});
    }


    //Procesamiento de imagenes en caso de que alguna pese más de 1MB
    const proccessedImgData = await processImgs(files);

    //Si algun elemento es null hubo algún fallo procesando las imagenes
    if (proccessedImgData.includes(null)){
        deleteDirContents('uploads');
        return res.status(400).json({err:'Error inseperado procesando las imagenes'});
    }

    //Se verifica que ninguna imagen haya quedado de más de 1MB
    if(proccessedImgData.some(img => img.size >= 1000000)){
        deleteDirContents('uploads');
        return res.status(400).json({err:'Alguna imagen es demasiado grande'});
    }

    next();
}


module.exports = {
    validateFields,
    validateFiles
};
