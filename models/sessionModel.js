const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000, // otomatis menghapus setelah 1 bulan (30 hari)
  },
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;