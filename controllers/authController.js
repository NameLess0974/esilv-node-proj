// controllers/authController.js
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  // Gérer les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, roleName } = req.body;

  try {
    let role;

    // Vérifier si un token JWT est fourni dans l'en-tête Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Vérifier si l'utilisateur est admin ou superadmin
        if (decoded.role === 'admin' || decoded.role === 'superadmin') {
          // Si roleName est fourni, tenter de trouver le rôle correspondant
          if (roleName) {
            role = await Role.findOne({ where: { name: roleName } });
            if (!role) {
              return res.status(400).json({ message: 'Rôle non valide' });
            }
          } else {
            // Si aucun roleName n'est fourni, assigner le rôle 'user' par défaut
            role = await Role.findOne({ where: { name: 'user' } });
          }
        } else {
          // Si l'utilisateur n'est pas admin ou superadmin, assigner le rôle 'user' par défaut
          role = await Role.findOne({ where: { name: 'user' } });
        }
      } catch (err) {
        // Si le token est invalide, assigner le rôle 'user' par défaut
        role = await Role.findOne({ where: { name: 'user' } });
      }
    } else {
      // Si aucun token n'est fourni, assigner le rôle 'user' par défaut
      role = await Role.findOne({ where: { name: 'user' } });
    }

    // Si le rôle n'a pas été trouvé, renvoyer une erreur
    if (!role) {
      return res.status(400).json({ message: 'Rôle non valide' });
    }

    // Créer l'utilisateur avec le rôle déterminé
    const user = await User.create({ username, password, roleId: role.id });

    // Répondre avec les détails de l'utilisateur (sans le mot de passe)
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: { id: user.id, username: user.username, role: role.name },
    });
  } catch (error) {
    // Gérer les erreurs (par exemple, doublon de nom d'utilisateur)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Nom d\'utilisateur déjà pris' });
    }
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  // Gérer les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  try {
    // Trouver l'utilisateur par nom d'utilisateur
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: 'role' }],
    });

    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (!user || !user.validPassword(password)) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Répondre avec le token
    res.json({ message: 'Connexion réussie', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
