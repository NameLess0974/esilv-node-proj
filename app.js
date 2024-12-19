require('dotenv').config(); // Charger les variables d'environnement
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const db = require('./models');

// Initialisation de l'application
const app = express();
const PORT = process.env.PORT || 3000;

// Import des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const authorRoutes = require('./routes/authorRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const borrowRoutes = require('./routes/borrowRoutes');

// Middlewares globaux
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Limitation des requêtes (prévention des attaques DoS)
if (process.env.NODE_ENV !== 'test') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard.',
  });
  app.use(limiter);
}

// Déclaration des routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/borrows', borrowRoutes);

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
});

// Synchronisation de la base de données et démarrage du serveur
db.sequelize
  .sync()
  .then(() => {
    console.log('Base de données synchronisée');
    app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));
  })
  .catch((err) => console.error('Erreur de synchronisation de la base de données:', err));

module.exports = app; // Pour les tests
