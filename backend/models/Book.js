const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    grade: { type: Number, required: false }
}, { _id: false }); // Utilisation de l'option _id: false pour le sous-document ratings

const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: false },
    userId: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings : [ratingSchema], // Utilisation du sous-document ratingSchema
    averageRating: { type: Number, required: false },
});

module.exports = mongoose.model('Book', bookSchema);



/* const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: false },
  userId: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings : [
    {
        userId: { type: String, required: false },
        grade: { type: Number, required: false },
    }
  ],
  averageRating: { type: Number, required: false },
});

module.exports = mongoose.model('Book', bookSchema); */