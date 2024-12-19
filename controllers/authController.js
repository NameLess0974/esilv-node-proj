const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Role } = require('../models');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const DEFAULT_ROLE = 'user';

// Créer un utilisateur (enregistrement)
exports.register = async (req, res) => {
  const { username, password, roleName = DEFAULT_ROLE } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
  }

  try {
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      return res.status(400).json({ message: 'Rôle non valide' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      username,
      password: hashedPassword,
      roleId: role.id,
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        username: user.username,
        role: role.name,
      },
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Nom d\'utilisateur déjà pris' });
    }
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
};

// Connexion utilisateur
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
  }

  try {
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: 'role' }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Connexion réussie',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
