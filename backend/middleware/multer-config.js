const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// !!! Rajouter un contrôle sur l'extension du fichier

const storage = multer.memoryStorage();

module.exports = multer({storage: storage}).single('image');