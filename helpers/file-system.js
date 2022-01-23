const fs = require('fs');
const path = require('path');


function deleteDirContents(directory) {

    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            if(!file.includes('.gitkeep')){
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });
    });
}


module.exports = {
    deleteDirContents
}