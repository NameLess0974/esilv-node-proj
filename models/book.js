const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate({ Author, Category, Review, Borrow }) {
      this.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });
      this.belongsToMany(Category, {
        through: 'BookCategories',
        foreignKey: 'bookId',
        as: 'categories',
      });
      this.hasMany(Review, { foreignKey: 'bookId', as: 'reviews' });
      this.hasMany(Borrow, { foreignKey: 'bookId', as: 'borrows' });
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
      volumes: DataTypes.INTEGER,
      chapters: DataTypes.INTEGER,
      pages: DataTypes.INTEGER,
      releaseDate: DataTypes.DATE,
      synopsis: DataTypes.TEXT,
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Authors', key: 'id' },
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
