// models/bookCategory.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BookCategory extends Model {
    static associate(models) {
      // Les associations sont déjà définies dans Book et Category
    }
  }
  BookCategory.init(
    {
      bookId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Books',
          key: 'id',
        },
        primaryKey: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Categories',
          key: 'id',
        },
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'BookCategory',
      tableName: 'BookCategories',
      timestamps: true,
    }
  );
  return BookCategory;
};
