const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', bookCtrl.createOneBook);

module.exports = router;