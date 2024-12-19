const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    static associate({ Book }) {
      this.hasMany(Book, { foreignKey: 'authorId', as: 'books' });
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
      biography: DataTypes.TEXT,
      birthDate: DataTypes.DATE,
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
