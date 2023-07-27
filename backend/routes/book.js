const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');

router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, bookCtrl.createOneBook);

module.exports = router;