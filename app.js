// app.js
require('dotenv').config(); 
const express = require('express');
const app = express();
const db = require('./models');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const authorRoutes = require('./routes/authorRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const borrowRoutes = require('./routes/borrowRoutes');

// Middlewares
app.use(express.json()); 
app.use(helmet());
app.use(cors());
app.use(morgan('combined')); 

// Limiter les requêtes pour prévenir les attaques DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard.',
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/borrows', borrowRoutes);

// Middleware de gestion des erreurs (optionnel)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Quelque chose a mal tourné!' });
});

// Synchronisation de la base de données et démarrage du serveur
const PORT = process.env.PORT || 3000;
db.sequelize
  .sync()
  .then(() => {
    console.log('Base de données synchronisée');
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur de synchronisation de la base de données:', err);
  });

  if (process.env.NODE_ENV !== 'test') {
    // Limiter les requêtes pour prévenir les attaques DoS
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limite chaque IP à 100 requêtes par fenêtre
      message: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard.',
    });
    app.use(limiter);
  }

module.exports = app; // Pour les tests