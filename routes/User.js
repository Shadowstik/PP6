const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/User');

router.post('/signup', userCtrl.signup); // envoie les infos d'un nouveau user
router.post('/login', userCtrl.login); // envoie les infos d'un user existant

module.exports = router;