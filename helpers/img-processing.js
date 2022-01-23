const { Buffer } = require('buffer');
const sharp = require('sharp');

function compressImg( imgData, format='jpeg' ) {
    return new Promise( (resolve, reject ) => {
        //solo png tiene la propiedad 'compressionLevel', todos los demas formatos tienen quality'
        const compression = format === 'png'? { compressionLevel: 9 } : { quality: 50 };

        sharp(imgData)
            .toFormat(format, compression)
            .withMetadata()
            .toBuffer()
            .then( data => resolve(data))
            .catch(err => reject(null));
    });
}

function determineFileFormat(char){
    switch (char) {
        case '/':
            return('jpeg');
        case 'i':
            return('png');
        case 'U':
            return('webp');
        default:
            return(undefined);
    }
}

async function processImg(img) {
    let imgString = img;

    if(imgString[0] === 'd'){
        //Si el primer char es una d hay que remover el data uri
        imgString = img.slice(img.indexOf(',')+1);
    }
    
    const imgData = Buffer.from(imgString, 'base64');

    if(imgData.length >= 1000000){
        //Se determina el formato del archivo
        const format = determineFileFormat(imgString[0])
        if(!format) reject('Formato de imagen inválido')

        try {
            const compressedImg = await compressImg(imgData, format);
            console.log(compressedImg.length);
            
        } catch (error) {
            console.log('Error en la compresión');
        }
        


    }
}
    
module.exports = {
    processImg
};
