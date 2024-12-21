const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.Author, { foreignKey: 'authorId', as: 'author' });
      Book.belongsToMany(models.Category, {
        through: 'BookCategories',
        foreignKey: 'bookId',
        as: 'categories',
      });
      Book.hasMany(models.Review, { foreignKey: 'bookId', as: 'reviews' });
      Book.hasMany(models.Borrow, { foreignKey: 'bookId', as: 'borrows' });
    }
  }
  Book.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      volumes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      chapters: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pages: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      releaseDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      synopsis: {
        type: DataTypes.TEXT,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Authors',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Book',
      tableName: 'Books',
      timestamps: true,
    }
  );
  return Book;
};
