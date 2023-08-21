const fs = require('fs');
const Book = require ('../models/Book');


exports.getAllBooks = (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
  }

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
  };

exports.createOneBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  console.log(req.file)
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  console.log(book);
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
    .catch(error => res.status(402).json({ error }));
  };

  exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Livre modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

 exports.deleteBook = (req, res, next) => {
  console.log(req.params.id);
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.rateOneBook = (req, res, next) => {
  const newRating = { ...req.body };
  delete newRating._userId;
  delete newRating._id;

  const userId = req.auth.userId;
  const bookId = req.params.id;

  Book.findById(bookId)
      .then((book) => {
          if (!book) {
              return res.status(404).json({ error: "Livre non trouvé." });
          }

          if (hasUserRatedBook(book, userId)) {
              return res.status(400).json({ error: "Vous avez déjà noté ce livre." });
          }

          const ratingData = {
              userId: userId,
              grade: newRating.rating
          };

          book.ratings.push(ratingData);

          // Calculer la nouvelle note moyenne
          const totalRatings = book.ratings.length;

          if (totalRatings > 0) {
            const totalGradeSum = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
            const newAverageRating = totalGradeSum / totalRatings;

            // Mettre à jour la note moyenne dans le modèle Book
            book.averageRating = parseFloat(newAverageRating.toFixed(1));
          } else {
            // Cas où il n'y a pas de notes, attribuer une valeur par défaut (par exemple, 0)
            book.averageRating = 0;
          }


          return book.save();
      })
      .then((updatedBook) => {
          res.status(200).json( updatedBook );
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

function hasUserRatedBook(book, userId) {
  return book.ratings.some((rating) => rating.userId === userId);
}


exports.bestrating = (req, res, next) => {
  Book.aggregate([
    {
      $match: { ratings: { $exists: true, $ne: [] } } // Filter books with non-empty ratings array
    },
    {
      $sort: { averageRating: -1 } // Sort the books in descending order of the existing averageRating field
    },
    {
      $limit: 3 // Get the top 3 best-rated books
    }
  ])
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

