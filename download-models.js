const https = require("https");
const fs = require("fs");
const path = require("path");

const modelsDir = path.join(__dirname, "public", "models");

// Create models directory if it doesn't exist
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const downloadFile = (url, filename) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(modelsDir, filename));
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`Downloaded ${filename}`);
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(path.join(modelsDir, filename), () => {});
        reject(err);
      });
  });
};

async function downloadModels() {
  try {
    // Download manifest files
    await downloadFile(
      "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json",
      "tiny_face_detector_model-weights_manifest.json",
    );

    await downloadFile(
      "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json",
      "face_expression_model-weights_manifest.json",
    );

    // Download the actual model weights (these are binary files)
    await downloadFile(
      "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1",
      "tiny_face_detector_model-shard1",
    );

    await downloadFile(
      "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1",
      "face_expression_model-shard1",
    );

    console.log("All models downloaded successfully!");
  } catch (error) {
    console.error("Error downloading models:", error);
  }
}

downloadModels();
