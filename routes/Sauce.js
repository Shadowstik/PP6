const express = require('express');
const router = express.Router(); 

const sauceCtrl = require('../controllers/Sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceCtrl.createSauce); // créer une nouvelle sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // modifie une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); // supprime une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); // récupère une sauce
router.get('/', auth, sauceCtrl.getAllSauces); // récupère toute les sauces
router.post('/:id/like', auth, sauceCtrl.likeOrDislike); // enovie les likes et dislikes

module.exports = router;