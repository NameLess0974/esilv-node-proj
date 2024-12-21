// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Assurez-vous que ce chemin est correct
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Obtenir tous les utilisateurs (admin et superadmin seulement)
router.get('/', authenticateToken, authorizeRoles('admin', 'superadmin'), userController.getAllUsers);

// Mettre à jour un utilisateur (admin et superadmin seulement)
router.put('/:id', authenticateToken, authorizeRoles('admin', 'superadmin'), userController.updateUser);

// Supprimer un utilisateur (admin et superadmin seulement)
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'superadmin'), userController.deleteUser);

module.exports = router;
