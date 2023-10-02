const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

// Store video chunks in memory until compilation
const chunksInMemory = {};

const collectChunks = async (req, res) => {
      const { file } = req;
      const sessionId = req.headers["x-session-id"]; // Unique identifier for the recording session

      // Ensure there's a session identifier
      if (!sessionId) {
        res.status(400).json({ error: "Session ID missing" });
        return;
      }

      // Check if the session already exists; if not, create a new one
      if (!chunksInMemory[sessionId]) {
        chunksInMemory[sessionId] = [];
      }

      // Store the received video chunk in memory
    chunksInMemory[sessionId].push(file);
     console.log(`Chunk added to session: ${sessionId}`);
 console.log(chunksInMemory);
      res.status(200).json({ message: "Video chunk uploaded successfully" });

}

const compileChunks = async (req, res) => {
    const sessionId = req.headers["x-session-id"]; // Unique identifier for the recording session

    // Ensure there's a session identifier
    if (!sessionId) {
      res.status(400).json({ error: "Session ID missing" });
      return;
    }

    // Check if the session exists
    if (!chunksInMemory[sessionId]) {
      res.status(400).json({ error: "Session not found" });
      return;
    }
    console.log(chunksInMemory);

    // Compile video chunks into a complete video
    const outputDir = "./output"; // Directory to store the final video
    const outputFileName = `${sessionId}.mp4`;// Name of the final video file


    if (!fs.existsSync(outputDir)) {
      // Create the directory using the 'mkdirSync' method
      fs.mkdirSync(outputDir);
    }
    console.log(outputDir.file);
     console.log(outputFileName);
    const command = ffmpeg();


    // Add the chunks to the FFmpeg command
    chunksInMemory[sessionId].forEach((file) => {
      command.input(file);
    });3

    // Specify any necessary FFmpeg processing options
    command.videoCodec("libx264").audioCodec("aac");

    // Set the output file path
    command.output(path.join(outputDir, outputFileName));

    // Execute the FFmpeg command
    command.on("end", () => {
      console.log("Video compilation complete");
      // Optionally, delete the uploaded chunks from memory
      delete chunksInMemory[sessionId];
      res.status(200).json({ message: "Video compilation complete" });
    });

    command.on("error", (err) => {
      console.error("Error compiling video:", err);
      res.status(500).json({ error: "Video compilation failed" });
    });

    // Run the FFmpeg command
    command.run();
};

// const compileChunks = async (req, res) => {
//   const sessionId = req.headers["x-session-id"]; // Unique identifier for the recording session

//   // Ensure there's a session identifier
//   if (!sessionId) {
//     res.status(400).json({ error: "Session ID missing" });
//     return;
//   }

//   // Check if the session already exists; if not, create a new one
//   if (!chunksInMemory[sessionId]) {
//     chunksInMemory[sessionId] = [];
//   }

//   // Compile video chunks into a complete video
//   const outputDir = "./output"; // Directory to store the final video
//   const outputFileName = `${sessionId}.mp4`; // Name of the final video file

//   const command = ffmpeg();

//   // Create a temporary directory if it doesn't exist
//   const tempDir = "./temp";
//   if (!fs.existsSync(tempDir)) {
//     fs.mkdirSync(tempDir);
//   }

//   // Add the chunks to the FFmpeg command
//   chunksInMemory[sessionId].forEach((chunkBuffer) => {
//     // Create a temporary file path for each chunk
//     const tempChunkFilePath = path.join(tempDir, `${uuid.v4()}.mp4`);

//     // Write the chunk data to the temporary file
//     fs.writeFileSync(tempChunkFilePath, chunkBuffer);

//     // Add the temporary chunk file to the FFmpeg command
//     command.input(tempChunkFilePath);
//   });

//   // Specify any necessary FFmpeg processing options
//   command.videoCodec("libx264").audioCodec("aac");

//   // Set the output file path
//   command.output(path.join(outputDir, outputFileName));

//   // Execute the FFmpeg command
//   command.on("end", () => {
//     console.log("Video compilation complete");

//     // Delete the temporary chunk files
//     chunksInMemory[sessionId].forEach((chunkBuffer) => {
//       const tempChunkFilePath = path.join(tempDir, `${uuid.v4()}.mp4`);
//       fs.unlinkSync(tempChunkFilePath);
//     });

//     // Delete the uploaded chunks from memory
//     delete chunksInMemory[sessionId];

//     res.status(200).json({ message: "Video compilation complete" });
//   });

//   command.on("error", (err) => {
//     console.error("Error compiling video:", err);
//     res.status(500).json({ error: "Video compilation failed" });
//   });

//   // Run the FFmpeg command
//   command.run();
// };

module.exports = {
    collectChunks,
    compileChunks
};
