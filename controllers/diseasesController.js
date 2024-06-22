const tf = require("@tensorflow/tfjs-node");
const { Firestore } = require("@google-cloud/firestore");
const crypto = require("crypto");

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

// Load model
exports.loadModel = async (modelUrl) => {
  try {
    const model = await tf.loadGraphModel(modelUrl);
    console.log("Model loaded successfully");
    return model;
  } catch (error) {
    console.error("Failed to load model:", error);
    throw error;
  }
};

async function storeData(id, data) {
  const db = new Firestore({
    databaseId: "petwell-firestore",
  });
  const predictCollection = db.collection("predictions");
  return predictCollection.doc(id).set(data);
}

async function predictSkinDisease(model, inputArray) {
  try {
    validateInputArray(inputArray); // Validate input array

    const tensor = tf.tensor2d([inputArray], [1, inputArray.length]); // Provide shape explicitly

    const predictions = model.predict(tensor);

    const predictionData = await predictions.data();
    console.log("Prediction data:", predictionData);

    const predictedClass = tf.argMax(predictionData).dataSync()[0];

    const diseaseClasses = ["Dermatitis", "Flea Allergy", "Ringworm", "Scabies", "Sehat"];

    const predictedDisease = diseaseClasses[predictedClass];

    let suggestion, explanation;
    switch (predictedDisease) {
      case "Dermatitis":
        suggestion = "Pastikan kebersihan lingkungan hewan peliharaan Anda dan konsultasikan dengan dokter hewan.";
        explanation = "Dermatitis adalah kondisi peradangan kulit yang bisa disebabkan oleh alergi atau iritasi.";
        break;
      case "Flea Allergy":
        suggestion = "Lakukan perawatan anti-kutu secara rutin dan bersihkan area tempat tinggal hewan.";
        explanation = "Alergi terhadap kutu terjadi karena gigitan kutu yang menyebabkan reaksi alergi pada kulit.";
        break;
      case "Ringworm":
        suggestion = "Gunakan obat anti-jamur dan jaga kebersihan hewan serta lingkungannya.";
        explanation = "Ringworm adalah infeksi jamur yang dapat menyebabkan gatal, bercak kulit merah, dan kerontokan bulu pada hewan.";
        break;
      case "Scabies":
        suggestion = "Segera konsultasikan ke dokter hewan dan lakukan perawatan anti-parasit.";
        explanation = "Scabies adalah infeksi kulit yang disebabkan oleh tungau, menyebabkan gatal dan iritasi.";
        break;
      case "Sehat":
        suggestion = "Terus jaga kesehatan hewan peliharaan dengan pola makan yang baik dan perawatan rutin.";
        explanation = "Hewan peliharaan Anda dalam kondisi sehat.";
        break;
    }

    return { predictedDisease, suggestion, explanation };
  } catch (error) {
    console.error("Prediction error:", error);
    throw new InputError(`Input error occurred: ${error.message}`);
  }
}

const validateInputArray = (inputArray) => {
  if (!Array.isArray(inputArray) || inputArray.length !== 10) {
    throw new InputError("Input array must be an array with length 10");
  }

  for (const value of inputArray) {
    if (typeof value !== "number" || value < 0 || value > 3) {
      throw new InputError("Each element in the input array must be a number between 0 and 3");
    }
  }
};

async function predictInsideAnjing(model, inputArray) {
  try {
    validateInputArray(inputArray); // Validate input array

    const tensor = tf.tensor2d([inputArray], [1, inputArray.length]); // Provide shape explicitly

    const predictions = model.predict(tensor);
    const predictionData = await predictions.data();
    console.log("Prediction data:", predictionData);

    const predictedClass = tf.argMax(predictionData).dataSync()[0];

    const diseaseClasses = ["Allergies", "Distemper", "Sehat", "Tick Fever"];

    const predictedDisease = diseaseClasses[predictedClass];

    let suggestion, explanation;
    switch (predictedDisease) {
      case "Allergies":
        suggestion = "Identifikasi dan hindari alergen serta konsultasikan dengan dokter hewan.";
        explanation = "Alergi pada anjing bisa disebabkan oleh berbagai faktor seperti makanan, lingkungan, atau parasit.";
        break;
      case "Distemper":
        suggestion = "Segera bawa anjing Anda ke dokter hewan untuk perawatan intensif.";
        explanation = "Distemper adalah penyakit virus serius yang bisa menyebabkan kematian jika tidak ditangani dengan benar.";
        break;
      case "Tick Fever":
        suggestion = "Lakukan pembersihan kutu secara rutin dan konsultasikan dengan dokter hewan.";
        explanation = "Tick fever disebabkan oleh infeksi yang ditularkan melalui gigitan kutu.";
        break;
      case "Sehat":
        suggestion = "Terus jaga kesehatan anjing Anda dengan pola makan yang baik dan perawatan rutin.";
        explanation = "Anjing Anda dalam kondisi sehat.";
        break;
    }

    return { predictedDisease, suggestion, explanation };
  } catch (error) {
    console.error("Prediction error:", error);
    throw new InputError(`Input error occurred: ${error.message}`);
  }
}

async function predictInsideKucing(model, inputArray) {
  try {
    validateInputArray(inputArray); // Validate input array

    const tensor = tf.tensor2d([inputArray], [1, inputArray.length]); // Provide shape explicitly

    const predictions = model.predict(tensor);
    const predictionData = await predictions.data();
    console.log("Prediction data:", predictionData);

    const predictedClass = tf.argMax(predictionData).dataSync()[0];

    const diseaseClasses = ["Enteritis", "FCV", "Panleukopenia", "Sehat"];

    const predictedDisease = diseaseClasses[predictedClass];

    let suggestion, explanation;
    switch (predictedDisease) {
      case "Enteritis":
        suggestion = "Berikan makanan yang mudah dicerna dan konsultasikan dengan dokter hewan.";
        explanation = "Enteritis adalah peradangan usus yang bisa menyebabkan diare dan dehidrasi.";
        break;
      case "FCV":
        suggestion = "Pastikan kucing Anda divaksinasi dan bawa ke dokter hewan untuk perawatan.";
        explanation = "FCV (Feline Calicivirus) adalah infeksi virus yang bisa menyebabkan masalah pernapasan dan mulut pada kucing.";
        break;
      case "Panleukopenia":
        suggestion = "Segera bawa kucing Anda ke dokter hewan untuk perawatan intensif.";
        explanation = "Panleukopenia adalah penyakit virus yang sangat menular dan bisa berakibat fatal jika tidak ditangani.";
        break;
      case "Sehat":
        suggestion = "Terus jaga kesehatan kucing Anda dengan pola makan yang baik dan perawatan rutin.";
        explanation = "Kucing Anda dalam kondisi sehat.";
        break;
    }

    return { predictedDisease, suggestion, explanation };
  } catch (error) {
    console.error("Prediction error:", error);
    throw new InputError(`Input error occurred: ${error.message}`);
  }
}

exports.postSkinDiseasePredictionHandler = async (req, res, next) => {
  try {
    const input = req.body; // Directly using input values
    // Proceed to prediction and storing in Firestore
    const model = req.app.locals.models["AnjingDanKucing"];
    const { predictedDisease, suggestion, explanation } = await predictSkinDisease(model, input);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: predictedDisease,
      suggestion: suggestion,
      explanation: explanation,
      createdAt: createdAt,
    };

    await storeData(id, data);

    res.status(201).json({
      status: "success",
      message: "Prediction successful.",
      data,
    });
  } catch (error) {
    // Handle errors
    next(error);
  }
};

exports.dalamAnjingController = async (req, res, next) => {
  try {
    const input = req.body; // Directly using input values
    // Proceed to prediction and storing in Firestore
    const model = req.app.locals.models["DalamAnjing"];
    const { predictedDisease, suggestion, explanation } = await predictInsideAnjing(model, input);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: predictedDisease,
      suggestion: suggestion,
      explanation: explanation,
      createdAt: createdAt,
    };

    await storeData(id, data);

    res.status(201).json({
      status: "success",
      message: "Prediction successful.",
      data,
    });
  } catch (error) {
    // Handle errors
    next(error);
  }
};

exports.dalamKucingController = async (req, res, next) => {
  try {
    const input = req.body; // Directly using input values
    // Proceed to prediction and storing in Firestore
    const model = req.app.locals.models["DalamKucing"];
    const { predictedDisease, suggestion, explanation } = await predictInsideKucing(model, input);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: predictedDisease,
      suggestion: suggestion,
      explanation: explanation,
      createdAt: createdAt,
    };

    await storeData(id, data);

    res.status(201).json({
      status: "success",
      message: "Prediction successful.",
      data,
    });
  } catch (error) {
    // Handle errors
    next(error);
  }
};