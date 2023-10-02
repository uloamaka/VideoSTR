const router = require("express").Router();
const { upload } = require("../utils/multer");
const {
  collectChunks,
  compileChunks,
} = require("../controllers/disk.controller");

router.post("/upload", upload.single("videoChunk"), collectChunks);
router.post("/stop-recording", upload.single("videoChunk"), compileChunks);

module.exports = router;
