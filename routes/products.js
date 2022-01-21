const { Router } = require('express');
const { body } = require('express-validator');
const { signIn, validatePassword } = require('../controllers/product');
const { validateResults } = require('./../middlewares');

const router = Router();

router.post('/signin', [
    body('email', 'El correo es obligatorio').notEmpty(),
    body('email', 'No es un correo valido').isEmail(),
    body('password', 'La contraseña es obligatoria').notEmpty(),
    validateResults
], signIn);


router.post('/pass', [
    body('password', 'la contraseña es obligatoria').notEmpty(),
    validateResults
], validatePassword);

module.exports = router;
