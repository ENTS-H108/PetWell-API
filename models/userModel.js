const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePict: {
    type: String,
    default: null
  },
  provider: {
    type: String,
    enum: ["reguler", "google"],
    default: "google",
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
});
UserSchema.methods.generateVerificationToken = function () {
  const user = this;
  const verificationToken = jwt.sign({ ID: user._id }, process.env.USER_VERIFICATION_TOKEN_SECRET, { expiresIn: "7d" });
  return verificationToken;
};
module.exports = mongoose.model("User", UserSchema);