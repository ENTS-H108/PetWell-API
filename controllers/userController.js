require("dotenv").config();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// fungsi register
exports.signup = async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(422).send({
      message: "Data tidak lengkap",
    });
  }

  try {
    // Memeriksa apakah email sudah digunakan
    const existingEmail = await User.findOne({ email }).exec();
    if (existingEmail) {
      return res.status(409).send({
        message: "Email sudah digunakan.",
      });
    }

    // Hash password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat dan menyimpan user
    const user = await new User({
      _id: new mongoose.Types.ObjectId(),
      email: email,
      username: username,
      password: hashedPassword,
    }).save();

    // Generate token verifikasi dengan user ID
    const verificationToken = user.generateVerificationToken();

    // Email ke user link verifikasi (unik)
    const url = `${process.env.BASE_URL}/verify/${verificationToken}`;

    transporter.sendMail({
      to: email,
      subject: "Verifikasi Akun",
      html: `Klik <a href = '${url}'>di sini</a> untuk mengkonfirmasi email Anda.`,
    });
    return res.status(201).send({
      message: `Email verifikasi telah dikirim ke ${email}`,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

// Fungsi login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Percobaan login:", { email, password });

  // Cek kelengkapan email dan password
  if (!email && !password) {
    return res.status(422).send({
      message: "Data tidak lengkap",
    });
  }

  try {
    // Cek apakah pengguna ditemukan
    const user = await User.findOne({ email }).exec();
    if (!user) {
      console.log("Pengguna tidak ditemukan:", email);
      return res.status(404).send({
        error: "Email atau Password salah",
      });
    }

    // Cek apakah akun telah terverifikasi
    if (!user.verified) {
      console.log("Akun belum diverifikasi:", email);
      return res.status(403).send({
        message: "Verifikasi akun Anda.",
      });
    }

    // Cek apakah password sesuai
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign({ id: user._id, }, process.env.JWT_KEY, { expiresIn: "5m" });
      console.log("Login berhasil untuk pengguna:", email);
      return res.status(200).json({
        message: "Login Berhasil",
        token,
      });
    } else {
      console.log("Password salah untuk pengguna:", email);
      return res.status(401).json({ error: "Email atau Password salah" });
    }
  } catch (err) {
    console.error("Internal server error during login:", err);
    return res.status(500).send({ message: "Kesalahan Server Internal", error: err });
  }
};

// Fungsi verifikasi email
exports.verify = async (req, res) => {
  const { token } = req.params;
  // Cek token
  if (!token) {
    return res.status(422).send({
      message: "Missing Token",
    });
  }
  // Verifikasi token dari URL
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
  } catch (err) {
    return res.status(500).send(err);
  }
  try {
    // Cari user dengan ID yang sesuai
    const user = await User.findOne({ _id: payload.ID }).exec();
    if (!user) {
      return res.status(404).send({
        message: "Pengguna tidak ditemukan",
      });
    }
    // Update status verifikasi user menjadi true
    user.verified = true;
    await user.save();
    return res.status(200).send({
      message: "Akun berhasil diverifikasi",
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

// Fungsi lupa password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(422).send({ message: "Email diperlukan" });
  }

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).send({ message: "Email tidak ditemukan" });
    }

    // Membuat token reset password menggunakan JWT
    const resetToken = jwt.sign({ ID: user._id }, process.env.USER_VERIFICATION_TOKEN_SECRET, { expiresIn: "1h" });

    // Membuat reset URL dengan environment variable
    const resetUrl = `https://www.entsh108.com/forgotPassword/${resetToken}`;

    transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `Klik <a href='${resetUrl}'>di sini</a> untuk reset password. Link ini hanya berlaku untuk 5 menit ke depan.`
    });

    return res.status(200).send({ message: `Sent a password reset email to ${email}` });
  } catch (err) {
    return res.status(500).send(err);
  }
};

// Fungsi untuk reset password
exports.resetPassword = async (req, res) => {
  const { newPassword, token } = req.body;
  if (!token || !newPassword) {
    return res.status(422).send({ message: "Token dan password baru diperlukan" });
  }

  try {
    // Verifikasi token
    let payload;
    try {
      payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
    } catch (err) {
      return res.status(500).send({ message: "Token tidak valid atau telah kadaluarsa" });
    }

    // Temukan pengguna berdasarkan ID yang ada di payload
    const user = await User.findOne({ _id: payload.ID }).exec();
    if (!user) {
      return res.status(404).send({ message: "Pengguna tidak ditemukan" });
    }

    // Hashing password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password pengguna
    user.password = hashedPassword;
    await user.save();

    return res.status(200).send({ message: "Password berhasil direset" });
  } catch (err) {
    return res.status(500).send(err);
  }
};