// controllers/authController.js
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

exports.register = async (req, res) => {
  const { username, password, roleName } = req.body;

  try {
    // Déterminer le rôle (par défaut à "user")
    const role = await Role.findOne({
      where: { name: roleName || 'user' },
    });
    if (!role) return res.status(400).json({ message: 'Rôle non valide' });

    // Créer l'utilisateur
    const user = await User.create({ username, password, roleId: role.id });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: { id: user.id, username, role: role.name },
    });
  } catch (error) {
    res.status(400).json({
      message: error.name === 'SequelizeUniqueConstraintError'
        ? 'Nom d\'utilisateur déjà pris'
        : error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: 'role' }],
    });

    if (!user || !user.validPassword(password)) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user.id, username, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Connexion réussie', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
