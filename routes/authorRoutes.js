// routes/authorRoutes.js
const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const { body } = require('express-validator');

// Créer un nouvel auteur (admin et librarian seulement) avec validation
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'superadmin', 'librarian'),
  [
    body('name')
      .isString()
      .notEmpty()
      .withMessage('Le nom de l\'auteur est requis'),
    body('biography').optional().isString(),
    body('birthDate').optional().isISO8601().toDate().withMessage('La date de naissance doit être une date valide'),
  ],
  authorController.createAuthor
);

// Obtenir tous les auteurs (accessible à tous les utilisateurs authentifiés)
router.get('/', authenticateToken, authorController.getAllAuthors);

// Obtenir un auteur par ID (accessible à tous les utilisateurs authentifiés)
router.get('/:id', authenticateToken, authorController.getAuthorById);

// Mettre à jour un auteur (admin et librarian seulement) avec validation
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'superadmin', 'librarian'),
  [
    body('name').optional().isString().notEmpty().withMessage('Le nom de l\'auteur doit être une chaîne de caractères non vide'),
    body('biography').optional().isString(),
    body('birthDate').optional().isISO8601().toDate().withMessage('La date de naissance doit être une date valide'),
  ],
  authorController.updateAuthor
);

// Supprimer un auteur (admin et librarian seulement)
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'superadmin', 'librarian'), authorController.deleteAuthor);

module.exports = router;
