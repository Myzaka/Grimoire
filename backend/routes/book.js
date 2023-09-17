const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multerCreate = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config');

router.get('/bestrating', bookCtrl.bestrating);
router.post('/:id/rating', auth, bookCtrl.rateOneBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multerCreate, sharp, bookCtrl.createOneBook);
router.put('/:id', auth, multerCreate, sharp, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;