// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const { authenticateToken } = require('../middlewares/authMiddleware'); // Importer le middleware d'authentification

// Inscription avec validation
router.post(
  '/register',
  [
    body('username')
      .isString()
      .notEmpty()
      .withMessage('Le nom d\'utilisateur est requis'),
    body('password')
      .isString()
      .isLength({ min: 6 })
      .withMessage('Le mot de passe doit comporter au moins 6 caractères'),
    body('roleName').optional().isString(),
  ],
  authController.register
);

// Connexion avec validation
router.post(
  '/login',
  [
    body('username')
      .isString()
      .notEmpty()
      .withMessage('Le nom d\'utilisateur est requis'),
    body('password')
      .isString()
      .notEmpty()
      .withMessage('Le mot de passe est requis'),
  ],
  authController.login
);

module.exports = router;
