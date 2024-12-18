const { Book, Author, Category } = require('../models');
const { validationResult } = require('express-validator');

// Fonction utilitaire pour gérer les erreurs de validation
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// Fonction utilitaire pour récupérer un auteur
const findAuthorById = async (authorId, res) => {
  const author = await Author.findByPk(authorId);
  if (!author) {
    res.status(404).json({ message: 'Auteur non trouvé' });
    return null;
  }
  return author;
};

// Création d'un livre
exports.createBook = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { title, volumes, pages, releaseDate, authorId, categoryIds } = req.body;
  try {
    if (!(await findAuthorById(authorId, res))) return;

    const book = await Book.create({ title, volumes, pages, releaseDate, authorId });

    if (Array.isArray(categoryIds)) {
      const categories = await Category.findAll({ where: { id: categoryIds } });
      await book.setCategories(categories);
    }

    res.status(201).json({ message: 'Livre créé avec succès', book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupération de tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: ['author', 'categories'],
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupération d'un livre par ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: ['author', 'categories'],
    });
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mise à jour d'un livre
exports.updateBook = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { id } = req.params;
  const { title, volumes, pages, releaseDate, authorId, categoryIds } = req.body;
  try {
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

    if (authorId && !(await findAuthorById(authorId, res))) return;

    await book.update({ title, volumes, pages, releaseDate, authorId });

    if (Array.isArray(categoryIds)) {
      const categories = await Category.findAll({ where: { id: categoryIds } });
      await book.setCategories(categories);
    }

    res.json({ message: 'Livre mis à jour avec succès', book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Suppression d'un livre
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

    await book.destroy();
    res.json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
