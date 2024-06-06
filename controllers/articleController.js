const Article = require("../models/articleModel");

exports.createArticle = async (req, res) => {
  try {
    const { title, desc, thumbnail, type } = req.body;

    if (!['artikel', 'promo'].includes(type)) {
      return res.status(400).json({
        error: true,
        message: "Tipe artikel tidak valid, harus 'artikel' atau 'promo'",
      });
    }

    const existingArticle = await Article.findOne({ title });
    if (existingArticle) {
      return res.status(400).json({
        error: true,
        message: "Gagal membuat artikel, judul sudah pernah digunakan",
      });
    }

    const article = await Article.create({ title, desc, thumbnail, type });
    console.log("Artikel berhasil ditambahkan:", article);
    res.json({ error: false, message: "success" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const { type } = req.query;

    if (type && !['artikel', 'promo'].includes(type)) {
      return res.status(400).json({
        error: true,
        message: "Tipe artikel tidak valid, harus 'artikel' atau 'promo'",
      });
    }

    const filter = type ? { type } : {};
    const articles = await Article.find(filter).select('-timestamp -__v');
    res.json({
      error: false,
      message: "List artikel berhasil diambil",
      listArticle: articles,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).select('-timestamp -__v');
    if (!article) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }
    res.json({ article });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { title, desc, thumbnail, type } = req.body;

    if (type && !['artikel', 'promo'].includes(type)) {
      return res.status(400).json({
        error: true,
        message: "Tipe artikel tidak valid, harus 'artikel' atau 'promo'",
      });
    }

    const article = await Article.findByIdAndUpdate(req.params.id, { title, desc, thumbnail, type }, { new: true }).select('-timestamp -__v');
    if (!article) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }
    console.log("Artikel berhasil diperbarui:", article);
    res.json({ error: false, message: "success" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }
    console.log("Artikel berhasil dihapus:", article);
    res.json({ message: "Artikel berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};