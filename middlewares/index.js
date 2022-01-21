const { ...fieldValidator } = require('./fields-validator');
const { ...dbValidator } = require('./db-validator');

module.exports = {
    ...fieldValidator,
    ...dbValidator,
};
