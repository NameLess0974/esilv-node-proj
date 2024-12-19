const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Role } = require('../models');

// Créer un utilisateur (enregistrement)
exports.register = async (req, res) => {
  const { username, password, roleName } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
  }

  try {
    // Déterminer le rôle (par défaut à "user")
    const role = await Role.findOne({ where: { name: roleName || 'user' } });
    if (!role) {
      return res.status(400).json({ message: 'Rôle non valide' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      username,
      password: hashedPassword,
      roleId: role.id,
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        username,
        role: role.name,
      },
    });
  } catch (error) {
    const message =
      error.name === 'SequelizeUniqueConstraintError'
        ? 'Nom d\'utilisateur déjà pris'
        : 'Erreur lors de la création de l\'utilisateur';

    res.status(400).json({ message });
  }
};

// Connexion utilisateur
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
  }

  try {
    // Trouver l'utilisateur et inclure son rôle
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: 'role' }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Durée de validité
    );

    res.json({
      message: 'Connexion réussie',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};
