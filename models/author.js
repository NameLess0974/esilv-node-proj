// models/author.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    static associate(models) {
      Author.hasMany(models.Book, { foreignKey: 'authorId', as: 'books' });
    }
  }
  Author.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      biography: {
        type: DataTypes.TEXT,
      },
      birthDate: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Author',
      tableName: 'Authors',
      timestamps: true,
    }
  );
  return Author;
};