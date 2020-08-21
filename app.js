const express = require('express');
require('dotenv').config(); // permet de cacher les données personnelles de l'utilisateur

const bodyParser = require('body-parser'); // convertit le corps des requêtes en objet JS
const mongoose = require('mongoose');
const path = require('path'); // renvoie le chemin des fichiers

const sauceRoutes = require('./routes/Sauce');
const userRoutes = require('./routes/User');

const app = express();

// empêche les erreurs de CORS pour que toute les requêtes soient acceptées
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // accès public de l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // les entêtes autorisés
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // les méthodes autorisées
    next();
});

app.use(bodyParser.json());

// middlewares
app.use('/images', express.static(path.join(__dirname, 'images'))); // pour le dossier 'images'
app.use('/api/sauces', sauceRoutes); // pour le CRUD des sauces 
app.use('/api/auth', userRoutes); // pour l'authentification des utilisateurs

module.exports = app;