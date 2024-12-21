// controllers/authorController.js
const { Author, Book } = require('../models');

exports.createAuthor = async (req, res) => {
  const { name, biography, birthDate } = req.body;
  try {
    const author = await Author.create({ name, biography, birthDate });
    res.status(201).json({ message: 'Auteur créé avec succès', author });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll({
      include: [{ model: Book, as: 'books' }],
    });
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAuthorById = async (req, res) => {
  const { id } = req.params;
  try {
    const author = await Author.findByPk(id, {
      include: [{ model: Book, as: 'books' }],
    });
    if (!author) {
      return res.status(404).json({ message: 'Auteur non trouvé' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAuthor = async (req, res) => {
  const { id } = req.params;
  const { name, biography, birthDate } = req.body;
  try {
    const author = await Author.findByPk(id);
    if (!author) {
      return res.status(404).json({ message: 'Auteur non trouvé' });
    }
    await author.update({ name, biography, birthDate });
    res.json({ message: 'Auteur mis à jour avec succès', author });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAuthor = async (req, res) => {
  const { id } = req.params;
  try {
    const author = await Author.findByPk(id);
    if (!author) {
      return res.status(404).json({ message: 'Auteur non trouvé' });
    }
    await author.destroy();
    res.json({ message: 'Auteur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
