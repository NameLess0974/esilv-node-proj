// Charger les variables d'environnement en premier
require('dotenv').config();

// Import des modules tiers
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression'); // Ajout de compression pour améliorer les performances

// Import des modules locaux
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const authorRoutes = require('./routes/authorRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const borrowRoutes = require('./routes/borrowRoutes');

// Initialisation de l'application
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration des middlewares globaux
app.use(express.json());

// Sécurité HTTP
app.use(helmet());

// Compression des réponses pour améliorer les performances
app.use(compression());

// Configuration de CORS avec des options plus restrictives si nécessaire
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Remplacez '*' par votre domaine en production
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Logging des requêtes HTTP
app.use(morgan('combined'));

// Limitation des requêtes (prévention des attaques DoS)
if (process.env.NODE_ENV !== 'test') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre
    standardHeaders: true, // Retourne les informations de limite dans les headers `RateLimit-*`
    legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
    message: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard.',
  });
  app.use(limiter);
}

// Déclaration des routes avec un préfixe commun
app.use('/api', [
  authRoutes,
  userRoutes,
  authorRoutes,
  categoryRoutes,
  bookRoutes,
  reviewRoutes,
  borrowRoutes,
]);

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Une erreur est survenue. Veuillez réessayer plus tard.' : err.message,
  });
});

// Fonction asynchrone pour démarrer le serveur
const startServer = async () => {
  try {
    await db.sequelize.authenticate(); // Vérifie la connexion à la base de données
    console.log('Connexion à la base de données réussie.');
    await db.sequelize.sync(); // Synchronise les modèles avec la base de données
    console.log('Base de données synchronisée.');

    app.listen(PORT, () => {
      console.log(`Serveur en écoute sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('Erreur lors du démarrage du serveur:', err);
    process.exit(1); // Arrête le processus en cas d'erreur critique
  }
};

// Démarrage du serveur uniquement si le fichier n'est pas importé (utile pour les tests)
if (require.main === module) {
  startServer();
}

module.exports = app; // Pour les tests
