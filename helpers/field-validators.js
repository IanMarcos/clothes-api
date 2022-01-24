const lookup = require('country-code-lookup');
const { getFormat, processImgs } = require('../helpers/img-processing');

function validateFields({req, res}) {

    let { name, description='', price, discount=0, country } = req.body;
    price = Number(price);
    discount = Number(discount);
    country = country.toUpperCase();

    if(!name || name.length === 0){
        res.status(400).json({err: 'Nombre obligatorio'});
        return {err: true};
    }

    if(!price || isNaN(price)){
        res.status(400).json({err: 'Precio no valido'});
        return {err: true};
    }

    if(discount <0 || discount>100){
        res.status(400).json({err: 'Descuento no valido'});
        return {err: true};
    }

    if( !country || country.length !== 2 || lookup.byIso(country) === null ){
        res.status(400).json({err: 'Código de País no valido'});
        return {err: true};
    }

    //Formato del precio a dos decimales
    if(price % 1 !== 0){
        price = round(price, 2);
    }

    //Validación de descuento por pais
    const max50 = ['CO', 'MX'];
    const max30 = ['CL', 'PE'];
    if(max50.includes(country) && discount > 50){
        res.status(400).json({err: 'Descuento muy alto para este país'});
        return {err: true};
    }
    if(max30.includes(country) && discount > 30){
        res.status(400).json({err: 'Descuento muy alto para este país'});
        return {err: true};
    }

    return {name, description, price, discount, country}
    
}

async function validateFiles({ files, res }){
    const validFormats = ['jpeg', 'jpg', 'png', 'webp'];
    if( files.some(file => !validFormats.includes( getFormat(file.mimetype) ))){
        res.status(400).json({err: 'Formato inadecuado de archivos'});
        return false;
    }

    //Procesamiento de imagenes en caso de que alguna pese más de 1MB
    const proccessedImgData = await processImgs(files);

    //Si algun elemento es null hubo algún fallo procesando las imagenes
    if (proccessedImgData.includes(null)){
        res.status(500).json({ err: 'Error inseperado procesando las imagenes' });
        return false;
    }

    //Se verifica que ninguna imagen haya quedado de más de 1MB
    if(proccessedImgData.some(img => img.size >= 1000000)){
        res.status(400).json({ err: 'Alguna imagen es demasiado grande' });
        return false;
    }
    
    return true;
}

function round(value, exp) {
    if (typeof exp === 'undefined' || +exp === 0)
        return Math.round(value);

    value = +value;
    exp = +exp;

    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
        return NaN;

    // Shift
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

module.exports = {
    validateFields,
    validateFiles
};
