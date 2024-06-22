const { spawn } = require("child_process");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

// Define a schema and model for predictions
const detectionSchema = new mongoose.Schema({
  object_name: String,
  score: Number,
  xmin: Number,
  ymin: Number,
  xmax: Number,
  ymax: Number,
});

const predictionSchema = new mongoose.Schema({
  _id: String,
  detections: [detectionSchema],
  imageURL: String,
  timestamp: { type: Date, default: Date.now },
});

const Prediction = mongoose.model("Prediction", predictionSchema);

class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ClientError";
  }
}

class InputError extends ClientError {
  constructor(message) {
    super(message);
    this.name = "InputError";
  }
}

async function storeData(id, imageData) {
  const imageURL = `${process.env.BASE_URL}/static/uploads/${id}.jpg`;

  const prediction = new Prediction({
    _id: id,
    detections: imageData.detections,
    imageURL: imageURL,
  });

  await prediction.save();
  return { imageURL };
}

async function sendImageToPython(imagePath, scriptName) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, `../ai/${scriptName}`);
    const pythonProcess = spawn("python3", [scriptPath, imagePath]);

    let resultData = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code: ${code}`);
        console.error(`Python script error: ${errorData}`);
        reject(new Error("Failed to process image"));
      } else {
        console.log(`Python script exited with code: ${code}`);
        if (errorData) {
          console.warn(`Python script warnings: ${errorData}`);
        }
        try {
          const result = JSON.parse(resultData.trim());
          const resultImagePath = result.result_image_path;
          const imageBuffer = fs.readFileSync(resultImagePath);
          resolve({ imageBuffer, detections: result.detections, resultImagePath });
        } catch (err) {
          reject(new Error("Failed to parse Python script output"));
        }
      }
    });
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../static/uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage }).single('image');

async function detect(req, res, next) {
  try {
    if (!req.file) {
      throw new InputError("Image is required");
    }

    const { scriptName } = req.body;
    if (!scriptName || (scriptName !== "kucing.py" && scriptName !== "anjing.py")) {
      throw new InputError("Valid script name (kucing.py or anjing.py) is required");
    }

    const imagePath = req.file.path;
    const docId = path.basename(imagePath, path.extname(imagePath));

    let imageData;
    try {
      imageData = await sendImageToPython(imagePath, scriptName);
      console.log("Detections:", imageData.detections);

      const newImagePath = path.join(__dirname, `../static/uploads/${docId}.jpg`);
      fs.writeFileSync(newImagePath, imageData.imageBuffer);
    } catch (error) {
      console.error("Error sending image to Python:", error);
      throw new Error("Failed to process image");
    }

    try {
      const result = await storeData(docId, imageData);
      const { imageURL } = result;
      console.log("Data stored in MongoDB with ID:", docId);

      res.status(200).json({
        message: "Image processed and data stored successfully",
        resultImagePath: imageURL,
      });
    } catch (error) {
      console.error("Error storing data in MongoDB:", error);
      throw new Error("Failed to store data in MongoDB");
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  upload,
  detect,
};