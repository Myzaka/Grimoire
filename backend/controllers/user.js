const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sanitizeHtml = require('sanitize-html');

exports.signup = (req, res, next) => {
    const { email, password } = req.body;

    // Valider l'adresse email
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Adresse email invalide' });
    }

    // Nettoyer les données saisies par l'utilisateur pour les champs email et password
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    // Continuer avec la création de l'utilisateur si l'adresse email est valide et les données sont nettoyées
    bcrypt.hash(sanitizedPassword, 10)
        .then(hash => {
            const user = new User({
                email: sanitizedEmail,
                password: hash
            });

            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
  const { email, password } = req.body;

  // Valider l'adresse email
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Adresse email invalide' });
  }

  // Nettoyer les données saisies par l'utilisateur
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedPassword = sanitizeInput(password);

  User.findOne({ email: sanitizedEmail })
    .then(user => {
      if (user === null) {
        res.status(401).json({ message: 'Non valide' });
      } else {
        bcrypt.compare(sanitizedPassword, user.password) // Utilisez la version nettoyée du mot de passe
          .then(valid => {
            if (!valid) {
              res.status(401).json({ message: 'Non valide' });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id },
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h' }
                )
              });
            }
          })
          .catch(error => res.status(500).json({ error }));
      }
    })
    .catch(error => res.status(400).json({ error }));
};
  

// Fonction pour vérifier le format de l'adresse email
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

// Fonction pour nettoyer les données saisies par l'utilisateur
function sanitizeInput(input) {
    return sanitizeHtml(input);
}
