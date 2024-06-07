const express = require("express");
const session = require("express-session");
const passport = require("./passport");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();

const PORT = process.env.PORT || 3000;

const db = require("./config/db");
const allRoutes = require("./routers/inRoute");

db.then(() => {
  console.log("Sukses melakukan koneksi ke MongoDB");
}).catch(() => {
  console.log("Gagal melakukan koneksi ke MongoDB");
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 250, // batasi setiap IP hingga 250 permintaan per windowMs
  message: "Terlalu banyak permintaan dari IP ini, coba lagi nanti.",
});

app.use(cors());
app.use(limiter); // Terapkan rate limiter untuk semua rute
app.use(helmet());
app.use(express.json());
app.use(allRoutes); //diambil dari index.js

app.listen(PORT, () => {
  console.log("Server berjalan pada port: " + PORT);
});
