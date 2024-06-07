const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' } // Token akan otomatis dihapus setelah 1 jam
});

const Blacklist = mongoose.model('Blacklist', blacklistSchema);