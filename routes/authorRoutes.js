const express = require('express');
const router = express.Router();
const {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/authorController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const { body } = require('express-validator');

// Middleware pour restreindre l'accès aux rôles spécifiques
const adminOrLibrarianAccess = [
  authenticateToken,
  authorizeRoles('admin', 'superadmin', 'librarian'),
];

// Validation commune pour les données des auteurs
const authorValidation = [
  body('name').optional().isString().notEmpty().withMessage('Le nom de l\'auteur doit être une chaîne non vide'),
  body('biography').optional().isString(),
  body('birthDate').optional().isISO8601().toDate().withMessage('La date de naissance doit être une date valide'),
];

// Routes auteur
router.post('/', ...adminOrLibrarianAccess, [
  body('name').isString().notEmpty().withMessage('Le nom de l\'auteur est requis'),
  ...authorValidation.slice(1), // Ajout des autres validations sauf "name" obligatoire
], createAuthor);

router.get('/', authenticateToken, getAllAuthors);
router.get('/:id', authenticateToken, getAuthorById);

router.put('/:id', ...adminOrLibrarianAccess, authorValidation, updateAuthor);

router.delete('/:id', ...adminOrLibrarianAccess, deleteAuthor);

module.exports = router;
