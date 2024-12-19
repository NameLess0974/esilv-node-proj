const { Category, Book } = require('../models');
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

// Création d'une catégorie
exports.createCategory = asyncHandler(async (req, res) => {
  handleValidationErrors(req);
  const category = await Category.create(req.body);
  res.status(201).json({ message: 'Catégorie créée avec succès', category });
});

// Récupération de toutes les catégories
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({
    include: [{ model: Book, as: 'books' }],
  });
  res.json(categories);
});

// Récupération d'une catégorie par ID
exports.getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await findEntityById(Category, id, 'Catégorie');
  await category.reload({
    include: [{ model: Book, as: 'books' }],
  });
  res.json(category);
});

// Mise à jour d'une catégorie
exports.updateCategory = asyncHandler(async (req, res) => {
  handleValidationErrors(req);
  const { id } = req.params;
  const category = await findEntityById(Category, id, 'Catégorie');
  await category.update(req.body);
  res.json({ message: 'Catégorie mise à jour avec succès', category });
});

// Suppression d'une catégorie
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await findEntityById(Category, id, 'Catégorie');
  await category.destroy();
  res.json({ message: 'Catégorie supprimée avec succès' });
});
