const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/Sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceCtrl.createProduct);
router.put('/:id', auth, multer, sauceCtrl.modifyProduct);
router.delete('/:id', auth, sauceCtrl.deleteProduct);
router.get('/:id', auth, sauceCtrl.getOneProduct);
router.get('/', auth, sauceCtrl.getAllProducts);
router.post('/:id/like', auth, sauceCtrl.likeOrDislike);

module.exports = router;