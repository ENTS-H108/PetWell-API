const Pet = require("../models/petModel");

exports.addPet = async (req, res) => {
  try {
    const { name, species, age } = req.body;
    const owner = req.user.id; // Mengambil ID pengguna dari token JWT yang telah diverifikasi

    const pet = await Pet.create({ name, species, age, owner });
    console.log("Hewan peliharaan berhasil ditambahkan:", pet);
    res.status(201).json({ error: false, message: "Hewan peliharaan berhasil ditambahkan", pet });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
