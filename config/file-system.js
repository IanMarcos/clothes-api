const path = require('path');
const findRemoveSync = require('find-remove');

function cleanOldFiles(directory) {
    setInterval(() => {
        findRemoveSync(path.join(__dirname, '..', directory), {
            files: '*.*',
            age: { seconds: 180 }
        });
    }, 600000);
}

module.exports = {
    cleanOldFiles
}