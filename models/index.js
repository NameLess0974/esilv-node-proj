// models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

// Importer tous les modèles dans le dossier models
fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js' && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Appliquer les associations définies dans chaque modèle
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
