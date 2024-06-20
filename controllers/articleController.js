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

    const article = await Article.create({
      title,
      desc,
      thumbnail,
      type
    });
    console.log("Artikel berhasil ditambahkan:", article);
    res.json({ error: false, message: "success" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const { type, page = 1, size = 10 } = req.query;

    if (type && !['artikel', 'promo'].includes(type)) {
      return res.status(400).json({
        error: true,
        message: "Tipe artikel tidak valid, harus 'artikel' atau 'promo'",
      });
    }

    const filter = type ? { type } : {};
    const limit = parseInt(size, 10);
    const skip = (parseInt(page, 10) - 1) * limit;

    const articles = await Article.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).select('-__v');
    const totalArticles = await Article.countDocuments(filter);

    res.json({
      error: false,
      message: "List artikel berhasil diambil",
      listArticle: articles,
      totalArticles,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalArticles / limit)
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
    const { id } = req.params;
    const { title, desc, thumbnail, type } = req.body;

    if (type && !['artikel', 'promo'].includes(type)) {
      return res.status(400).json({
        error: true,
        message: "Tipe artikel tidak valid, harus 'artikel' atau 'promo'",
      });
    }

    const article = await Article.findByIdAndUpdate(
      id,
      { title, desc, thumbnail, type },
      { new: true }
    ).select('-timestamp -__v');
    if (!article) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }
    console.log("Artikel berhasil diperbarui:", article);
    res.json({ error: false, message: "Artikel berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findByIdAndDelete(id);
    if (!article) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }
    console.log("Artikel berhasil dihapus");
    res.status(200).json({ error: false, message: "Artikel berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};