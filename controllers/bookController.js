const { Book, Author, Category } = require('../models');
const { validationResult } = require('express-validator');

// Middleware pour capturer les erreurs asynchrones
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Fonction utilitaire pour gérer les erreurs de validation
const handleValidationErrors = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Error');
    error.status = 400;
    error.details = errors.array();
    throw error;
  }
};

// Fonction utilitaire pour récupérer une entité par ID
const findEntityById = async (Model, id, entityName) => {
  if (!id) {
    const error = new Error(`${entityName} ID est requis`);
    error.status = 400;
    throw error;
  }

  const entity = await Model.findByPk(id);
  if (!entity) {
    const error = new Error(`${entityName} non trouvé`);
    error.status = 404;
    throw error;
  }
  return entity;
};

// Création d'un livre
exports.createBook = asyncHandler(async (req, res) => {
  handleValidationErrors(req);

  const { title, volumes, pages, releaseDate, authorId, categoryIds } = req.body;

  // Vérifier si l'auteur existe
  await findEntityById(Author, authorId, 'Auteur');

  // Créer le livre
  const book = await Book.create({ title, volumes, pages, releaseDate, authorId });

  // Associer les catégories si elles existent
  if (Array.isArray(categoryIds)) {
    const categories = await Category.findAll({ where: { id: categoryIds } });
    await book.setCategories(categories);
  }

  res.status(201).json({ message: 'Livre créé avec succès', book });
});

// Récupération de tous les livres
exports.getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.findAll({
    include: ['author', 'categories'],
  });
  res.json(books);
});

// Récupération d'un livre par ID
exports.getBookById = asyncHandler(async (req, res) => {
  const book = await findEntityById(Book, req.params.id, 'Livre');
  res.json(book);
});

// Mise à jour d'un livre
exports.updateBook = asyncHandler(async (req, res) => {
  handleValidationErrors(req);

  const { id } = req.params;
  const { title, volumes, pages, releaseDate, authorId, categoryIds } = req.body;

  // Trouver le livre à mettre à jour
  const book = await findEntityById(Book, id, 'Livre');

  // Vérifier si l'auteur existe si authorId est fourni
  if (authorId) await findEntityById(Author, authorId, 'Auteur');

  // Mettre à jour le livre
  await book.update({ title, volumes, pages, releaseDate, authorId });

  // Mettre à jour les catégories
  if (Array.isArray(categoryIds)) {
    const categories = await Category.findAll({ where: { id: categoryIds } });
    await book.setCategories(categories);
  }

  res.json({ message: 'Livre mis à jour avec succès', book });
});

// Suppression d'un livre
exports.deleteBook = asyncHandler(async (req, res) => {
  const book = await findEntityById(Book, req.params.id, 'Livre');
  await book.destroy();
  res.json({ message: 'Livre supprimé avec succès' });
});
