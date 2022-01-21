const jwt = require('jsonwebtoken');

const jwtKey = process.env.SECRETJWTKEY;

const generateJWT = (payload) => {
    //Forma sincrónica
    const rules = { expiresIn: '15m'}
    return jwt.sign(payload, jwtKey, rules);
}

const verifyJWT = (token) => {
    try {
        return jwt.verify(token, jwtKey); 
    } catch (error) {
        return {};
    }
}

module.exports = {
    generateJWT,
    verifyJWT
};
