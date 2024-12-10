// controllers/userController.js
const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: [{ model: Role, as: 'role', attributes: ['name'] }] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, roleName } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (password) user.password = await bcrypt.hash(password, 10); // Hachage du mot de passe
    if (username) user.username = username;

    if (roleName) {
      const role = await Role.findOne({ where: { name: roleName } });
      if (!role) return res.status(400).json({ message: 'Rôle non valide' });
      user.roleId = role.id;
    }

    await user.save();
    res.json({ message: 'Utilisateur mis à jour avec succès', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    await user.destroy();
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
