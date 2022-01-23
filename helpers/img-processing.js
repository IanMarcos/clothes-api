const sharp = require('sharp');
sharp.cache(false);

async function compressImg( imgPath, format='jpeg') {
    //solo png tiene la propiedad 'compressionLevel', todos los demas formatos tienen quality'
    const compression = format === 'png'? { compressionLevel: 9 } : { quality: 1 };

    try {
        //Pasar la imagen a Buffer y luego comprimir la imagen permite sobreescribir el archivo original sin riesgo
        const buffer = await sharp(imgPath)
        .withMetadata()
        .toBuffer()

        const info = await sharp(buffer)
        .toFormat(format, compression)
        .withMetadata()
        .toFile(imgPath)

        return info;
        
    } catch (error) {
        return null;
    }
}

function getFormat(mimetype){
    return mimetype.slice(mimetype.indexOf('/')+1);
}


async function processImgs(imgs) {
    const newImgs = imgs.map( async(img) => {

        const { mimetype, originalname, path, size } = img
        if(size <= 1000000){
            return img;
        }

        //Se determina el formato del archivo
        const format = getFormat(mimetype);

        try {
            const compressedImg = await compressImg(path, format, originalname);
            if(compressedImg.size <= 1000000){
                return compressedImg;
            }

            const { width, height } = compressedImg;
            return await resizeImg(path, format, width/2, height/2);
            
        } catch (error) {
            console.log(error);
            return null;
        }
    });
    
    return newImgs;
}

async function resizeImg( imgPath, format, w, h ) {
    const compression = format === 'png'? { compressionLevel: 9 } : { quality: 1 };
    try {
        const buffer = await sharp(imgPath)
        .resize(w, h)
        .withMetadata()
        .toBuffer()

        const info = await sharp(buffer)
        .toFormat(format, compression)
        .withMetadata()
        .toFile(imgPath)

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
