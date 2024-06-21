const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const tf = require("@tensorflow/tfjs-node");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const db = require("./config/db");
const allRoutes = require("./routers/inRoute");

app.set("trust proxy", 1);

app.get("/ip", (req, res) => {
  res.send(`Your IP address: ${req.ip}`);
});

db.then(() => {
  console.log("Sukses melakukan koneksi ke MongoDB");
}).catch(() => {
  console.log("Gagal melakukan koneksi ke MongoDB");
});

async function loadModelFromURL(modelName, modelUrl, weightsUrl) {
  try {
    console.log(`Memuat model ${modelName} dari: ${modelUrl}`);
    console.log(`Memuat bobot ${modelName} dari: ${weightsUrl}`);

    let model;
    if (modelName === "DeteksiKucing" || modelName === "DeteksiAnjing") {
      model = await tf.loadGraphModel(modelUrl);
    } else {
      model = await tf.loadLayersModel(modelUrl);
    }
    console.log(`Model ${modelName} berhasil dimuat`);

    return model;
  } catch (error) {
    console.error(`Gagal memuat model ${modelName}:`, error);
    throw error;
  }
}

async function startServer() {
  try {
    const modelsConfig = [
      {
        name: "AnjingDanKucing",
        modelUrl: process.env.AnjingDanKucingURL,
        weightsUrl: process.env.AnjingDanKucingWEIGHTS_URL,
      },
      {
        name: "DalamAnjing",
        modelUrl: process.env.DalamAnjingURL,
        weightsUrl: process.env.DalamAnjingWEIGHTS_URL,
      },
      {
        name: "DalamKucing",
        modelUrl: process.env.DalamKucingURL,
        weightsUrl: process.env.DalamKucingWEIGHTS_URL,
      },
      {
        name: "DeteksiKucing",
        modelUrl: process.env.DeteksiKucingURL,
        weightsUrl: process.env.DeteksiKucingWEIGHTS_URL,
      },
      {
        name: "DeteksiAnjing",
        modelUrl: process.env.DeteksiAnjingURL,
        weightsUrl: process.env.DeteksiAnjingWEIGHTS_URL,
      },
    ];

    for (const { name, modelUrl, weightsUrl } of modelsConfig) {
      if (!modelUrl || !weightsUrl) {
        throw new Error(`MODEL_URL atau WEIGHTS_URL untuk ${name} tidak diatur`);
      }

      // Load the model
      const model = await loadModelFromURL(name, modelUrl, weightsUrl);

      // Attach the model to the app locals
      app.locals.models = app.locals.models || {};
      app.locals.models[name] = model;
    }

    // Rate limiter configuration
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 menit
      max: 250, // batasi setiap IP hingga 250 permintaan per windowMs
      message: "Terlalu banyak permintaan dari IP ini, coba lagi nanti.",
    });

    // Middleware setup
    app.use(cors());
    app.use(limiter); // Terapkan rate limiter untuk semua rute
    app.use(helmet());
    app.use(express.json());
    app.use(allRoutes); // Routes from routers/inRoute
    app.use("/static", express.static(path.join(__dirname, "static")));

    // Start the server
    app.listen(PORT, () => {
      console.log("Server berjalan pada port: " + PORT);
    });
  } catch (error) {
    console.error("Failed to start server due to model loading error:", error);
  }
}

// Mulai server setelah memuat model
startServer();
