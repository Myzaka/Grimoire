const path = require('path');
const sharp = require("sharp");

module.exports = async (req, res, next) => {
  try {
      const { buffer, originalname } = req.file;
      const fileInfo = path.parse(originalname);
      const ref = Date.now()+`-${fileInfo.name}.webp`;

      const outputPath = path.join(__dirname, '..', 'images', ref);

      await sharp(buffer)
          .webp({ quality: 20 })
          .toFile(outputPath);
      req.imageRef = ref;
      next();
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error processing image.' });
  }
};

