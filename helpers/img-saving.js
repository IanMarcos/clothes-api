const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const saveImgToHosting = async (files) => {
    //Array de promises
    const url = `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}`
    
    const toPost = files.map( file => {
        const data = new FormData();
        data.append('image',fs.createReadStream(file.path));
        
        //retorna un promise
        return axios.post(url, data, {
            headers: data.getHeaders()
        });
        
    });

    const images = [];
    try {
        const results = await Promise.all(toPost);
        let errorFlag = false;
        for(const result of results){
            const {status, data:{data: {url}}} = result;
            if(status !== 200){
                errorFlag = true;
            }
            images.push(url);
        }

        if(errorFlag) throw new Error('Error al guardar imagenes en hosting')

        return images;

    } catch (error) {
        return undefined;
    }
}

module.exports = {
    saveImgToHosting
};
