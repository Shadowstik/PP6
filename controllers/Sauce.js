const Product = require('../models/Product');
const fs = require('fs');

exports.createProduct = (req, res, next) => {
    const productObject = JSON.parse(req.body.sauce);
    delete productObject._id;
    const product = new Product({
        ...productObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    product.save()
        .then(() => res.status(201).json({ message: 'Sauce créé !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyProduct = (req, res, next) => {
    const productObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
        Product.updateOne({ _id: req.params.id}, { ...productObject, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteProduct = (req, res, next) => {
    Product.findOne({ _id: req.params.id})
        .then(product => {
            const filename = product.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Product.deleteOne({ _id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneProduct = (req, res, next) => {
    Product.findOne({ _id: req.params.id})
        .then(product => res.status(200).json(product))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllProducts = (req, res, next) => {
    Product.find()
        .then(products => res.status(200).json(products))
        .catch(error => res.status(400).json({ error }));
};

exports.likeOrDislike = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;

    Product.findOne({ _id: req.params.id })
        .then(product => {
            nbLikes = product.likes;
            nbDislikes = product.dislikes;
            arrayUsersLiked = product.usersLiked;
            arrayUsersDisliked = product.usersDisliked;
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
            Product.updateOne({ _id: req.params.id }, {  
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