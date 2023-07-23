const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://compte_technique:53bPTZjHhtE%40@cluster0.uqhoutf.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.get('/api/books', (req, res, next) => {
    const books = [
      {
        userId: 'oeihfzeoi',
        title: 'Les 3 Mousquetaires',
        author: 'Alexandre Dumas',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        year : 1840,
        genre : 'Aventure',
        ratings : [
            {
                userId: 'oeihfzeoi',
                grade: 5
            }
        ],
        averageRating: 5
      },
      {
        userId: 'oeihfzeoi',
        title: 'Conan le Flibustier',
        author: 'Robert E. Howard',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        year : 1930,
        genre : 'Heroic Fantasy',
        ratings : [
            {
                userId: 'oeihfzeoi',
                grade: 4
            }
        ],
        averageRating: 4
      },
      {
        userId: 'oeihfzeoi',
        title: 'Bonjour tristesse',
        author: 'Françoise Sagan',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        year : 1967,
        genre : 'Roman triste',
        ratings : [
            {
                userId: 'oeihfzeoi',
                grade: 2
            }
        ],
        averageRating: 2
      },
    ];
    res.status(200).json(books);
  });


module.exports = app;