const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  type: { type: Number, default: null },
  timestamp: { type: Date, default: null },
  detail: { type: String, default: null },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true }
});

const History = mongoose.model("History", historySchema);

module.exports = History;