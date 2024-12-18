require('dotenv').config();

const defaultConfig = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'your_postgres_password',
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'postgres', // Modifier selon la base utilisée
  logging: false, // Désactive le logging SQL
};

module.exports = {
  development: {
    ...defaultConfig,
    database: process.env.DB_NAME || 'gestion_bibliotheque',
  },
  test: {
    ...defaultConfig,
    database: process.env.DB_NAME || 'gestion_bibliotheque_test',
  },
  production: {
    ...defaultConfig,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  },
};
