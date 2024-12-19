// controllers/userController.js
const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');

// Middleware pour capturer les erreurs asynchrones
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Fonction utilitaire pour récupérer un utilisateur par ID
const findUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [{ model: Role, as: 'role', attributes: ['name'] }],
  });
  if (!user) {
    const error = new Error('Utilisateur non trouvé');
    error.status = 404;
    throw error;
  }
  return user;
};

// Récupérer tous les utilisateurs
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    include: [{ model: Role, as: 'role', attributes: ['name'] }],
  });
  res.json(users);
});

// Mettre à jour un utilisateur
exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, password, roleName } = req.body;

  // Récupérer l'utilisateur
  const user = await findUserById(id);

  // Hachage du mot de passe s'il est fourni
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  // Mise à jour du nom d'utilisateur
  if (username) {
    user.username = username;
  }

  // Vérifier et mettre à jour le rôle
  if (roleName) {
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      const error = new Error('Rôle non valide');
      error.status = 400;
      throw error;
    }
    user.roleId = role.id;
  }

  await user.save();
  res.json({ message: 'Utilisateur mis à jour avec succès', user });
});

// Supprimer un utilisateur
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await findUserById(req.params.id);
  await user.destroy();
  res.json({ message: 'Utilisateur supprimé avec succès' });
});
