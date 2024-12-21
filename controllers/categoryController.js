// controllers/categoryController.js
const { Category, Book } = require('../models');

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = await Category.create({ name, description });
    res.status(201).json({ message: 'Catégorie créée avec succès', category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Book, as: 'books' }],
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id, {
      include: [{ model: Book, as: 'books' }],
    });
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    await category.update({ name, description });
    res.json({ message: 'Catégorie mise à jour avec succès', category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    await category.destroy();
    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
