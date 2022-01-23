const { Router } = require('express');
const { body } = require('express-validator');
const multer  = require('multer');
const path = require('path');
const { createProduct, getProducts } = require('../controllers/product');
const { validateResults } = require('./../middlewares');

//Configuración de multer para que guarde archivos con su extensión
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });
const router = Router();

router.post('/', upload.array('prodImg', 2), createProduct);


router.post('/pass', [
    body('password', 'la contraseña es obligatoria').notEmpty(),
    validateResults
], getProducts);

module.exports = router;
