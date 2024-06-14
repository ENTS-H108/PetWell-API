const Pet = require("../models/petModel");
const History = require("../models/historyModel");

exports.createPet = async (req, res) => {
  try {
    const { name, species, age } = req.body;
    const owner = req.user.id;

    if (!["anjing", "kucing", "Anjing", "Kucing"].includes(species)) {
      return res.status(400).json({
        error: true,
        message: "Gagal menambahkan hewan peliharaan, spesies hanya bisa anjing atau kucing",
      });
    }

    const pet = await Pet.create({ name, species, age, owner });
    console.log("Hewan peliharaan berhasil ditambahkan:", pet);

    const { __v, ...petData } = pet.toObject();

    res.status(201).json({ error: false, message: "Hewan peliharaan berhasil ditambahkan", ...petData });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.getPets = async (req, res) => {
  try {
    const owner = req.user.id;

    const pets = await Pet.find({ owner }).select('-__v');

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
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id }).select('-__v');
    if (!pet) {
      return res.status(404).json({ message: "Hewan peliharaan tidak ditemukan" });
    }

    const histories = await History.find({ pet: pet._id })
    .sort({ timestamp: -1 })
    .select('-__v -pet');
    
    const historyList = histories.map(hist => ({ type: hist.type, timestamp: hist.timestamp }));

    let response = { error: false, ...pet.toObject(), history: historyList };
    if (historyList.length === 0) {
      response.message = `Pet ${pet.name} belum memiliki history aktivitas apapun`;
    }

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const { name, species, age } = req.body;

    if (species && !["anjing", "kucing", "Anjing", "Kucing"].includes(species)) {
      return res.status(400).json({
        error: true,
        message: "Gagal memperbarui hewan peliharaan, spesies hanya bisa anjing atau kucing",
      });
    }

    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { name, species, age },
      { new: true }
    ).select('-__v');
    if (!pet) {
      return res.status(404).json({ message: "Hewan peliharaan tidak ditemukan" });
    }

    console.log("Hewan peliharaan berhasil diperbarui:", pet);
    res.json({ error: false, message: "Hewan peliharaan berhasil diperbarui", ...pet.toObject() });
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

    await History.deleteMany({ pet: pet._id });

    console.log("Hewan peliharaan berhasil dihapus:", pet);
    res.json({ error: false, message: "Hewan peliharaan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.addHistory = async (req, res) => {
  try {
    const { type } = req.body;
    const petId = req.params.id;

    const pet = await Pet.findOne({ _id: petId, owner: req.user.id });
    if (!pet) {
      return res.status(404).json({ message: "Hewan peliharaan tidak ditemukan" });
    }

    const history = await History.create({ type, pet: petId });
    console.log("History berhasil ditambahkan:", history);

    res.status(201).json({ error: false, message: "History berhasil ditambahkan", history });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
