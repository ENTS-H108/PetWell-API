const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  profpict: { type: String, default: null },
  profile: { type: String, required: true },
  experiences: { type: String, required: true },
  year: { type: String, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
  price: { type: String, required: true },
  hospital: { type: String, required: true },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;