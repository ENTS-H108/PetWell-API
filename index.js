const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();

const PORT = process.env.PORT || 3000;

const db = require("./config/db");
const allRoutes = require("./routers/inRoute");

db.then(() => {
  console.log("Berhasil Connect Ke MongoDB");
}).catch(() => {
  console.log("gagal konek ke mongoDB");
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
//diambil dari index.js
app.use(allRoutes);

app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});
