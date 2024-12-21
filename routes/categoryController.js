// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const { body } = require('express-validator');

// Créer une nouvelle catégorie (admin seulement) avec validation
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  [
    body('name')
      .isString()
      .notEmpty()
      .withMessage('Le nom de la catégorie est requis'),
    body('description').optional().isString(),
  ],
  categoryController.createCategory
);

// Obtenir toutes les catégories
router.get('/', authenticateToken, categoryController.getAllCategories);

// Obtenir une catégorie par ID
router.get('/:id', authenticateToken, categoryController.getCategoryById);

// Mettre à jour une catégorie (admin seulement) avec validation
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  [
    body('name').optional().isString().notEmpty().withMessage('Le nom de la catégorie doit être une chaîne de caractères non vide'),
    body('description').optional().isString(),
  ],
  categoryController.updateCategory
);

// Supprimer une catégorie (admin seulement)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), categoryController.deleteCategory);

module.exports = router;
