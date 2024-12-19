const { Category, Book } = require('../models');

const handleError = (res, error, statusCode = 500) => 
  res.status(statusCode).json({ error: error.message });

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ message: 'Catégorie créée avec succès', category });
  } catch (error) {
    handleError(res, error, 400);
  }
};

exports.getAllCategories = async (_, res) => {
  try {
    const categories = await Category.findAll({ include: [{ model: Book, as: 'books' }] });
    res.json(categories);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, { include: [{ model: Book, as: 'books' }] });
    if (!category) return res.status(404).json({ message: 'Catégorie non trouvée' });
    res.json(category);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Catégorie non trouvée' });
    await category.update(req.body);
    res.json({ message: 'Catégorie mise à jour avec succès', category });
  } catch (error) {
    handleError(res, error, 400);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Catégorie non trouvée' });
    await category.destroy();
    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    handleError(res, error);
  }
};
