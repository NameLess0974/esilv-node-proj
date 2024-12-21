// config/config.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'your_postgres_password',
    database: process.env.DB_NAME || 'gestion_bibliotheque',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres', // ou 'mysql' si vous utilisez MySQL
    logging: false, // Désactiver le logging SQL
  },
  test: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'your_postgres_password',
    database: process.env.DB_NAME || 'gestion_bibliotheque_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  },
};
