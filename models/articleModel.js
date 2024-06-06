const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    thumbnail: { type: String, required: true },
    type: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;