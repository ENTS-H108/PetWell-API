require("dotenv").config();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const Blacklist = require('../models/blacklistModel.js');
const Session = require("../models/sessionModel.js");
const { OAuth2Client } = require('google-auth-library');

// Transporter email
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Fungsi verifikasi email
const verifyEmail = async (email, res) => {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).send({
        message: "Pengguna tidak ditemukan",
      });
    }

    if (user.verified) {
      return res.status(400).send({
        message: "Akun anda sudah terverifikasi, silahkan login",
      });
    }

    const verificationToken = jwt.sign(
      { ID: user._id },
      process.env.USER_VERIFICATION_TOKEN_SECRET,
    );

    const url = `${process.env.BASE_URL}/verify/${verificationToken}`;

    transporter.sendMail({
      to: email,
      subject: "Verifikasi Akun PetWell",
      html: `Klik <a href='${url}'>di sini</a> untuk mengkonfirmasi email Anda.`,
    });

    return res.status(201).send({
      message: `Email verifikasi telah dikirim ke ${email}`,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

// Fungsi register
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !username || !password) {
    return res.status(422).send({
      message: "Data tidak lengkap",
    });
  }

  try {
    // Memeriksa apakah email sudah digunakan
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      if (existingUser.provider === "google") {
        // User exists dengan provider Google, update password and rubah provider dengan multiProvider
        existingUser.password = await bcrypt.hash(password, 10);
        existingUser.provider = "multiProvider";
        existingUser.username = username;
        existingUser.verified = false;

        await existingUser.save();
        await verifyEmail(email, res);
      } else if (existingUser.provider === "reguler" || existingUser.provider === "multiProvider") {
        return res.status(409).send({
          message: "Email telah digunakan.",
        });
      }
    } else {
      // Hash password menggunakan bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Membuat dan menyimpan user baru
      const user = await new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        username,
        password: hashedPassword,
        provider: "reguler",
      }).save();

      // Panggil fungsi verifyEmail untuk mengirim email verifikasi
      await verifyEmail(email, res);
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

// Fungsi untuk mengirim notifikasi email login
const sendLoginNotificationEmail = async (email, username) => {
  const loginNotificationEmail = {
    to: email,
    subject: "Login Ditemukan di Akun Petwell Anda",
    html: `
      <p>Hai ${username},</p>
      <p>Login baru ditemukan dari aplikasi Petwell menggunakan akun email Anda (${email}).</p>
      <p>Jika ini bukan Anda, silakan segera reset password melalui aplikasi PetWell!</a>.</p>
      <p>Jika ini Anda, abaikan pesan ini.</p>
      <br>
      <p>Terima kasih,</p>
      <p>Tim Petwell</p>
    `
  };

  try {
    await transporter.sendMail(loginNotificationEmail);
    console.log(`Login notification email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending login notification email to ${email}:`, error);
  }
};

// Fungsi sesi dan blacklist
const createNewSession = async (user, res) => {
  // Blacklist the previous token if it exists
  const previousSession = await Session.findOne({ userId: user._id }).exec();
  if (previousSession) {
    await Blacklist.create({ token: previousSession.token });
    await Session.deleteOne({ _id: previousSession._id });
  }

  // Create a new token
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);

  // Save the new session
  await Session.create({ userId: user._id, token });

  // Send login notification email
  await sendLoginNotificationEmail(user.email, user.username);

  console.log("Login berhasil untuk pengguna:", user.email);
  return res.status(200).json({
    message: "Login berhasil",
    token: token,
  });
};

// Fungsi login reguler
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Percobaan login reguler:", { email });
  const user = await User.findOne({ email }).exec();

  // Cek apakah provider adalah Google
  if (user.provider === "google") {
    console.log("Percobaan logi reguler gagal, pengguna berikut memiliki akun bertipe google:", email);
    return res.status(403).send({
      message: "Anda mendaftar dengan akun Google. Silakan login dengan Google.",
    });
  }

  // Cek kelengkapan email dan password
  if (!email && !password) {
    console.log("Percobaan login baru terdeteksi, data tidak lengkap untuk akun: ", email);
    return res.status(422).send({
      message: "Data tidak lengkap",
    });
  }

  try {
    // Cek apakah pengguna ditemukan
    if (!user) {
      console.log("Percobaan login baru terdeteksi, pengguna ditemukan: ", email);
      console.log("Pengguna tidak ditemukan:", email);
      return res.status(404).send({
        error: "Email atau Password salah",
      });
    }

    // Cek apakah akun telah terverifikasi
    if (!user.verified) {
      console.log("Percobaan login baru terdeteksi, akun belum diverifikasi:", email);
      return res.status(403).send({
        message: "Verifikasi akun Anda.",
      });
    }

    // Cek apakah password sesuai dan benar
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return await createNewSession(user, res);
    } else {
      console.log("Password salah untuk pengguna:", email);
      return res.status(401).json({ error: "Email atau Password salah" });
    }
  } catch (err) {
    console.error("Kesalahan server internal selama login:", err);
    return res.status(500).send({ message: "Kesalahan Server Internal", error: err });
  }
};

//Fungsi verifikasi token google
const client = new OAuth2Client(process.env.CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    console.log("Percobaan login gagal, token google invalid");
    throw new Error('Invalid Google token');
  }
}

//Fungsi login google
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const payload = await verifyGoogleToken(token);
    const { email, sub: googleId } = payload;

    console.log("Percobaan login google:", { email });

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = "multiProvider";
      }
    } else {
      user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: payload.email,
        username: payload.name,
        googleId: googleId,
        provider: "google",
        verified: true,
      });
    }
    await user.save();
    return await createNewSession(user, res);
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(401).json({ message: 'Invalid Google Token' });
  }
};

// Fungsi verifikasi email
exports.verify = async (req, res) => {
  const { token } = req.params;
  // Cek token
  if (!token) {
    return res.status(422).send({
      message: "Token tidak ditemukan",
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

  console.log("Percobaan reset password terdeteksi pada akun: ", email);

  if (!email) {
    return res.status(422).send({ message: "Email diperlukan" });
  }

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).send({ message: "Email tidak ditemukan" });
    }

    // Membuat token reset password menggunakan JWT
    const resetToken = jwt.sign({ ID: user._id }, process.env.USER_VERIFICATION_TOKEN_SECRET, { expiresIn: "5m" });

    // Membuat reset URL dengan environment variable
    const resetUrl = `https://www.entsh108.com/forgotPassword/${resetToken}`;

    transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `Klik <a href='${resetUrl}'>di sini</a> untuk reset password. Link ini hanya berlaku untuk 5 menit ke depan.`
    });

    return res.status(200).send({ message: `Link untuk mereset password telah dikrim ke ${email}` });
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

// Fungsi untuk mendapatkan profil pengguna
exports.getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("email username profilePict").exec();
    if (!user) {
      return res.status(404).send({ message: "Pengguna tidak ditemukan" });
    }

    return res.status(200).json({
      email: user.email,
      username: user.username,
      profilePict: user.profilePict,
    });
  } catch (err) {
    return res.status(500).send({ message: "Kesalahan Server Internal", error: err });
  }
};

// Fungsi untuk mengupdate profil pengguna
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, profilePict } = req.body;

  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).send({ message: "Pengguna tidak ditemukan" });
    }

    user.username = username || user.username;
    user.profilePict = profilePict || user.profilePict;

    await user.save();

    return res.status(200).json({
      message: "Profil berhasil diperbarui",
      user: {
        email: user.email,
        username: user.username,
        profilePict: user.profilePict,
      }
    });
  } catch (err) {
    return res.status(500).send({ message: "Kesalahan Server Internal", error: err });
  }
};