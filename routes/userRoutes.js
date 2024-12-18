const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Middleware pour restreindre l'accès aux rôles admin et superadmin
const adminAccess = [authenticateToken, authorizeRoles('admin', 'superadmin')];

// Routes utilisateur
router.get('/', ...adminAccess, getAllUsers);
router.put('/:id', ...adminAccess, updateUser);
router.delete('/:id', ...adminAccess, deleteUser);

module.exports = router;
