const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  type: { type: Number, default: null },
  date: { type: Date, default: null },
  description: { type: String, default: null }
});

module.exports = historySchema;