const bcrypt = require('bcrypt');

const hashPassword = async(plainPassword) => {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

const passwordMatch = async(plainPassword, userPassword) => {
    return await bcrypt.compare(plainPassword, userPassword);
}
    
module.exports = {
    passwordMatch,
    hashPassword
};
