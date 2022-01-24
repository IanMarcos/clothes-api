const { Router } = require('express');
const multer  = require('multer');
const path = require('path');
const { createProduct, getProducts } = require('../controllers/product');

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

router.post('/new', upload.array('prodImg', 5), createProduct);

router.get('/all', getProducts);

module.exports = router;
