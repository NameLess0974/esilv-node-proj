const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Validation commune pour créer et mettre à jour un livre
const validateBook = [
  body('title')
    .optional({ nullable: true })
    .isString()
    .notEmpty()
    .withMessage('Le titre du livre doit être une chaîne de caractères non vide'),
  body('volumes')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le nombre de volumes doit être un entier positif'),
  body('pages')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le nombre de pages doit être un entier positif'),
  body('releaseDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('La date de sortie doit être une date valide'),
  body('authorId')
    .optional()
    .isInt()
    .withMessage('L\'ID de l\'auteur doit être un entier'),
  body('categoryIds')
    .optional()
    .isArray()
    .withMessage('Les IDs des catégories doivent être un tableau d\'entiers'),
];

// Créer un nouveau livre (admin, superadmin, librarian)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'superadmin', 'librarian'),
  validateBook,
  bookController.createBook
);

// Obtenir tous les livres
router.get('/', authenticateToken, bookController.getAllBooks);

// Obtenir un livre par ID
router.get('/:id', authenticateToken, bookController.getBookById);

// Mettre à jour un livre (admin, superadmin, librarian)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'superadmin', 'librarian'),
  validateBook,
  bookController.updateBook
);

// Supprimer un livre (admin, superadmin, librarian)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'superadmin', 'librarian'),
  bookController.deleteBook
);

module.exports = router;
