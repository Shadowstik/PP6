const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/Sauce');
const auth = require('../middleware/auth');

router.post('/', auth, sauceCtrl.createProduct);
router.put('/:id', auth, sauceCtrl.modifyProduct);
router.delete('/id', auth, sauceCtrl.deleteProduct);
router.get('/:id', auth, sauceCtrl.getOneProduct);
router.get('/', auth, sauceCtrl.getAllProducts);
router.post('/:id/like', auth, sauceCtrl.likeOrDislike);

module.exports = router;