const Pet = require("../models/petModel");

exports.createPet = async (req, res) => {
  try {
    const { name, species, age } = req.body;
    const owner = req.user.id; // Mengambil ID pengguna dari token JWT yang telah diverifikasi

    // Validasi spesies hewan peliharaan
    if (!["anjing", "kucing"].includes(species)) {
      return res.status(400).json({
        error: true,
        message: "Gagal menambahkan hewan peliharaan, spesies hanya bisa anjing atau kucing",
      });
    }

    const pet = await Pet.create({ name, species, age, owner });
    console.log("Hewan peliharaan berhasil ditambahkan:", pet);
    
    const { __v, ...petData } = pet.toObject();

    res.status(201).json({ error: false, message: "Hewan peliharaan berhasil ditambahkan", pet: { ...petData, owner } });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};


exports.getPets = async (req, res) => {
  try {
    const owner = req.user.id; // Mengambil ID pengguna dari token JWT yang telah diverifikasi

    const pets = await Pet.find({ owner });

    // Memeriksa apakah pengguna memiliki hewan peliharaan atau tidak
    if (pets.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Anda belum memiliki hewan peliharaan",
      });
    }

    res.status(200).json({
      error: false,
      message: "Daftar hewan peliharaan berhasil diambil",
      pets,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};


exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id }).select('-timestamp -__v');
    if (!pet) {
      return res.status(404).json({ message: "Hewan peliharaan tidak ditemukan" });
    }
    res.json({ error: false, pet });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const { name, species, age } = req.body;
    const pet = await Pet.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, { name, species, age }, { new: true });
    if (!pet) {
      return res.status(404).json({ message: "Hewan peliharaan tidak ditemukan" });
    }
    console.log("Hewan peliharaan berhasil diperbarui:", pet);
    res.json({ error: false, message: "Hewan peliharaan berhasil diperbarui", pet });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!pet) {
      return res.status(404).json({ message: "Hewan peliharaan tidak ditemukan" });
    }
    console.log("Hewan peliharaan berhasil dihapus:", pet);
    res.json({ error: false, message: "Hewan peliharaan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};