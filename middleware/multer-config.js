const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// enregistrement dans le disque
const storage = multer.diskStorage({ 
    destination: (req, file, callback) => { // la destination du fichier enregistré
        callback(null, 'images')
    },
    filename: (req, file, callback) => { // génération du nom du fichier 
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype]; // extension du fichier ajouté
        callback(null, name + Date.now() + '.' + extension); // nom du fichier + numéro unique + extension
    }
});

module.exports = multer({ storage }).single('image');