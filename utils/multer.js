const multer = require("multer");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

// Create a directory to temporarily store video chunks
const chunkDir = './uploads';

if (!fs.existsSync(chunkDir)) {
  fs.mkdirSync(chunkDir);
}

// Define a storage engine for multer to save uploaded video chunks
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Change the directory as needed
  },
  filename: (req, file, cb) => {
    const fileName = `${uuid.v4()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

module.exports = { upload };
