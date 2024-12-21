// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const { body } = require('express-validator');

// Créer un nouveau livre (admin, superadmin, et librarian seulement) avec validation
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'superadmin', 'librarian'),
  [
    body('title')
      .isString()
      .notEmpty()
      .withMessage('Le titre du livre est requis'),
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
      .isInt()
      .withMessage('L\'ID de l\'auteur doit être un entier'),
    body('categoryIds')
      .optional()
      .isArray()
      .withMessage('Les IDs des catégories doivent être un tableau d\'entiers'),
  ],
  bookController.createBook
);

// Obtenir tous les livres (accessible à tous les utilisateurs authentifiés)
router.get('/', authenticateToken, bookController.getAllBooks);

// Obtenir un livre par ID (accessible à tous les utilisateurs authentifiés)
router.get('/:id', authenticateToken, bookController.getBookById);

// Mettre à jour un livre (admin, superadmin, et librarian seulement) avec validation
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'superadmin', 'librarian'),
  [
    body('title')
      .optional()
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
  ],
  bookController.updateBook
);

// Supprimer un livre (admin, superadmin, et librarian seulement)
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'superadmin', 'librarian'), bookController.deleteBook);

module.exports = router;
