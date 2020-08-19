const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/Sauce');

router.post('/', sauceCtrl.createProduct);
router.put('/:id', sauceCtrl.modifyProduct);
router.delete('/id', sauceCtrl.deleteProduct);
router.get('/:id', sauceCtrl.getOneProduct);
router.get('/', sauceCtrl.getAllProducts);
router.get('/:id/like', sauceCtrl.likeOrDislike);

module.exports = router;