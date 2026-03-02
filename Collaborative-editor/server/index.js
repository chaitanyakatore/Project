const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// 1. A temporary in-memory database to store our documents
// (In production, this would be Redis or PostgreSQL)
const documentStore = {};

io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // 2. Listen for a user asking to load a specific document
  socket.on("get-document", (documentId) => {
    // Put the user in a private room for this specific document
    socket.join(documentId);

    // Fetch the document from our "database" (or create a blank one if it doesn't exist)
    const data = documentStore[documentId] || "";

    // Send the saved text ONLY to the user who just joined
    socket.emit("load-document", data);

    // 3. Listen for changes, but ONLY broadcast to this specific room
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("send-cursor", (range) => {
      socket.broadcast.to(documentId).emit("receive-cursor", {
        id: socket.id,
        range: range,
      });
    });
    // 4. Listen for save requests to update our "database"
    socket.on("save-document", (data) => {
      documentStore[documentId] = data;
    });
  });
});

const PORT = 5001; // Using your correct port!
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
