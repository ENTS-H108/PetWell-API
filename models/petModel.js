const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  age: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Referensi ke pemilik hewan dari model User
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
