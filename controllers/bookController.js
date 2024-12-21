// controllers/bookController.js
const { Book, Author, Category } = require('../models');
const { validationResult } = require('express-validator');

exports.createBook = async (req, res) => {
  // Gérer les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, volumes, pages, releaseDate, authorId, categoryIds } = req.body;
  try {
    // Vérifier si l'auteur existe
    const author = await Author.findByPk(authorId);
    if (!author) {
      return res.status(404).json({ message: 'Auteur non trouvé' });
    }

    // Créer le livre
    const book = await Book.create({ title, volumes, pages, releaseDate, authorId });

    // Associer les catégories si fournies
    if (categoryIds && Array.isArray(categoryIds)) {
      const categories = await Category.findAll({ where: { id: categoryIds } });
      await book.setCategories(categories);
    }

    res.status(201).json({ message: 'Livre créé avec succès', book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        { model: Author, as: 'author' },
        { model: Category, as: 'categories' },
      ],
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id, {
      include: [
        { model: Author, as: 'author' },
        { model: Category, as: 'categories' },
      ],
    });
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  // Gérer les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, volumes, pages, releaseDate, authorId, categoryIds } = req.body;
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    // Vérifier si l'auteur existe si authorId est fourni
    if (authorId) {
      const author = await Author.findByPk(authorId);
      if (!author) {
        return res.status(404).json({ message: 'Auteur non trouvé' });
      }
    }

    // Mettre à jour les informations du livre
    await book.update({ title, volumes, pages, releaseDate, authorId });

    // Mettre à jour les catégories si fournies
    if (categoryIds && Array.isArray(categoryIds)) {
      const categories = await Category.findAll({ where: { id: categoryIds } });
      await book.setCategories(categories);
    }

    res.json({ message: 'Livre mis à jour avec succès', book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    await book.destroy();
    res.json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
