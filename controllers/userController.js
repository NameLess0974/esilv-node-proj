// controllers/userController.js
const { User, Role } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as: 'role', attributes: ['name'] }],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  // Gérer les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { username, password, roleName } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Si un nouveau mot de passe est fourni, le hasher
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Si roleName est fourni, vérifier et mettre à jour le rôle
    if (roleName) {
      const role = await Role.findOne({ where: { name: roleName } });
      if (!role) {
        return res.status(400).json({ message: 'Rôle non valide' });
      }
      user.roleId = role.id;
    }

    // Mettre à jour le nom d'utilisateur si fourni
    if (username) {
      user.username = username;
    }

    await user.save();

    res.json({ message: 'Utilisateur mis à jour avec succès', user: { id: user.id, username: user.username, role: roleName || user.role.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    await user.destroy();
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
