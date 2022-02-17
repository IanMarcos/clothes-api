const sharp = require('sharp');
sharp.cache(false);

async function compressImg( {path, format='jpeg'}) {
    //solo png tiene la propiedad 'compressionLevel', todos los demas formatos tienen quality'
    const compression = format === 'png'? { compressionLevel: 9 } : { quality: 1 };

    try {
        //Pasar la imagen a Buffer y luego comprimir la imagen permite sobreescribir el archivo original sin riesgo
        const buffer = await sharp(path)
        .withMetadata()
        .toBuffer()

        const info = await sharp(buffer)
        .toFormat(format, compression)
        .withMetadata()
        .toFile(path)

        info.path = path;
        info.format = format;

        return info;
        
    } catch (error) {
        return null;
    }
}

function getFormat(mimetype){
    return mimetype.slice(mimetype.indexOf('/')+1);
}

async function processImgs(imgs) {

    const imgsToCompress = [];  //array de promises
    const imgsToResize = [];    //array de promises
    let definitiveImgs = [];    //array de objetos

    //Primero se buscan las imagenes demasiado grandes y se tratan de comprimir
    for(const img of imgs){
        if(img.size <= 1000000){
            definitiveImgs.push(img);
            continue;
        }
        //Se determina el formato del archivo
        const { mimetype, path } = img
        const format = getFormat(mimetype);
        imgsToCompress.push(compressImg({path, format}));
    }

    if(imgsToCompress.lenght === 0) return definitiveImgs;

    const compressedImgs = await Promise.all(imgsToCompress);

    //Si comprimir la imagen falla, se intenta reducir su tamaño a la mitad
    for(const img of compressedImgs){
        //Si es null falló la compresión. Se retorna para dar el error luego
        if(img === null || img.size <= 1000000){
            definitiveImgs.push(img);
            continue;
        }
        const { format, path, width, height } = img;
        imgsToResize.push(resizeImg({path, format, w:width/2, h:height/2}))
    }

    if(imgsToCompress.lenght === 0) return definitiveImgs;

    const resizedImgs = await Promise.all(imgsToResize);
    definitiveImgs = [...definitiveImgs, ...resizedImgs];

    return definitiveImgs;
}

async function resizeImg( {path, format, w, h} ) {
    const compression = format === 'png'? { compressionLevel: 9 } : { quality: 1 };
    try {
        const buffer = await sharp(path)
        .resize(w, h)
        .withMetadata()
        .toBuffer()

        const info = await sharp(buffer)
        .toFormat(format, compression)
        .withMetadata()
        .toFile(path)


        return info;
        
    } catch (error) {
        console.log(error);
        return null;
    }
}
    
module.exports = {
    getFormat,
    processImgs
};
