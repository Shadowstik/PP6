const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createProduct = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce créé !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyProduct = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteProduct = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneProduct = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllProducts = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

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
                //verifie si l'utilisateur est présent dans le tableau de usersLiked
                if (arrayUsersLiked.filter(user => user === userId)[0] === userId) {
                    //enlève un like
                    nbLikes -= 1;
                    arrayUsersLiked = arrayUsersLiked.filter(user => user != userId);
                }
                //verifie si l'utilisateur est présent dans le tableau de usersDisliked
                else if (arrayUsersDisliked.filter(user => user === userId)[0] === userId) {
                    //enlève un dislake
                    nbDislikes -= 1;
                    arrayUsersDisliked = arrayUsersDisliked.filter(user => user != userId);
                }
            } else if (like === 1) {
                //ajoute un like
                nbLikes += 1;
                arrayUsersLiked.push(userId);
            } else if (like === -1) {
                //ajoute un dislike
                nbDislikes += 1;
                arrayUsersDisliked.push(userId);
            }
            //upadte la sauce avec le nouveau nombre de likes/dislikes et le tableau de usersLiked/usersDisliked
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