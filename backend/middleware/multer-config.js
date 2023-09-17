/*const multer = require('multer');

const storage = multer.memoryStorage();

module.exports = multer({storage: storage}).single('image');*/


const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).single('image');

module.exports = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Une erreur liée à Multer s'est produite lors du téléchargement du fichier.
            return res.status(400).json({ error: 'Erreur lors du téléchargement du fichier' });
        } else if (!req.file) {
            // Aucun fichier n'a été fourni.
            return next(); // Passez au middleware suivant.
        } else if (err) {
            // Une autre erreur s'est produite.
            return res.status(500).json({ error: 'Une erreur s\'est produite lors du téléchargement du fichier' });
        }
        
        // Si nous arrivons ici, cela signifie qu'un fichier a été téléchargé avec succès.
        next();
    });
};
