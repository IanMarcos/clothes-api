const { validationResult } = require('express-validator');

const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json( {err: errors.array()} );
    }
    next();
}

module.exports = {validateResults};
