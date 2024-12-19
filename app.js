// app.js

// Charger les variables d'environnement en premier
require('dotenv').config();

// Import des modules tiers
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createLogger, format, transports } = require('winston');
const expressWinston = require('express-winston');

// Import des modules locaux
const db = require('./models');

// Import des routes
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

// Configuration du Logger avec Winston
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    }),
    // Vous pouvez ajouter d'autres transports ici (fichiers, services externes, etc.)
  ],
});

// Middleware de journalisation des requêtes HTTP
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true, // Inclure les métadonnées dans les logs
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
}));

// Middlewares globaux
app.use(express.json()); // Parsing du JSON
app.use(helmet()); // Sécurité des en-têtes HTTP
app.use(compression()); // Compression des réponses HTTP

// Configuration de CORS avec des options restrictives
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Remplacez '*' par votre domaine en production
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Limitation des requêtes pour prévenir les attaques DoS
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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/borrows', borrowRoutes);

// Gestion des routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Middleware de journalisation des erreurs
app.use(expressWinston.errorLogger({
  winstonInstance: logger,
}));

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  logger.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Une erreur est survenue. Veuillez réessayer plus tard.' : err.message,
  });
});

// Fonction asynchrone pour démarrer le serveur
const startServer = async () => {
  try {
    await db.sequelize.authenticate(); // Vérifie la connexion à la base de données
    logger.info('Connexion à la base de données réussie.');
    await db.sequelize.sync(); // Synchronise les modèles avec la base de données
    logger.info('Base de données synchronisée.');

    const server = app.listen(PORT, () => {
      logger.info(`Serveur en écoute sur le port ${PORT}`);
    });

    // Gestion des arrêts gracieux
    const gracefulShutdown = () => {
      logger.info('Arrêt du serveur...');
      server.close(async () => {
        logger.info('Serveur arrêté.');
        try {
          await db.sequelize.close();
          logger.info('Connexion à la base de données fermée.');
          process.exit(0);
        } catch (err) {
          logger.error('Erreur lors de la fermeture de la base de données:', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (err) {
    logger.error('Erreur lors du démarrage du serveur:', err);
    process.exit(1); // Arrête le processus en cas d'erreur critique
  }
};

// Démarrage du serveur uniquement si le fichier est exécuté directement
if (require.main === module) {
  startServer();
}

module.exports = app; // Pour les tests
d