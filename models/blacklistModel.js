const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    },
  createdAt: { type: Date, default: Date.now, expires: '30d' } // Token akan otomatis dihapus setelah 30 hari
});

const Blacklist = mongoose.model("Blacklist", blacklistSchema);

module.exports = Blacklist;