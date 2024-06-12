const mongoose = require("mongoose");
const historySchema = require("./historyModel");

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  age: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail: { type: String, default: null },
  history: { type: [historySchema], default: [] }
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;