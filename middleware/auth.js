const jwt = require('jsonwebtoken');

// authentification via un token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'b42729f94825ed04c95dfc422e1e9a4c02a4805d30c080697d38f92c72752158');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) { // si le userId est diiférent de celui du token
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) { // renvoie le moindre erreur d'authentification
        res.status(401).json({ error: error | 'Requête non authentifiée !'})
    };
};