const Sauce = require('../models/Sauce');
const fs = require('fs'); // file system

// LOGIQUE

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({ 
        ...sauceObject,
        // http://localhost:3000/images/'nom du fichier'
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // valeur par défaut des likes et dislikes
        likes: 0, 
        dislikes: 0,
        // tableau des utilisateur ayant liker ou disliker
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce créé !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    { // si une image est existante
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body}; // si il n'y a pas d'image
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id}) // recherche de l'url de l'image
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // nom exacte du fichier
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find() // lis toute les sauces dans la BDD
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// likes et dislikes
exports.likeOrDislike = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            nbLikes = sauce.likes;
            nbDislikes = sauce.dislikes;
            arrayUsersLiked = sauce.usersLiked;
            arrayUsersDisliked = sauce.usersDisliked;
            if (like === 0) {
                // si l'utilisateur existe dans usersLiked
                if (arrayUsersLiked.filter(user => user === userId)[0] === userId) {
                    nbLikes -= 1;
                    arrayUsersLiked = arrayUsersLiked.filter(user => user != userId);
                }
                // si l'utilisateur existe dans  usersDisliked
                else if (arrayUsersDisliked.filter(user => user === userId)[0] === userId) {
                    nbDislikes -= 1;
                    arrayUsersDisliked = arrayUsersDisliked.filter(user => user != userId);
                }
            } else if (like === 1) {
                nbLikes += 1;
                arrayUsersLiked.push(userId);
            } else if (like === -1) {
                nbDislikes += 1;
                arrayUsersDisliked.push(userId);
            }
            //upadte la sauce avec le nouveau nombre de likes/dislikes et usersLiked/usersDisliked
            Sauce.updateOne({ _id: req.params.id }, {  
                likes: nbLikes,
                usersLiked: arrayUsersLiked,
                dislikes: nbDislikes,
                usersDisliked: arrayUsersDisliked
            })
            .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
            .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(404).json({error}));
};