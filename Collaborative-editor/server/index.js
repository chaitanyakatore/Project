const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const Document = require("./Document"); // 1. Import your Mongoose model

const app = express();
app.use(cors());
const server = http.createServer(app);

// 2. Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/collab-editor")
  .then(() => console.log("🗄️ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// A helper function to fetch from DB, or create a blank one if it's new
async function findOrCreateDocument(id) {
  if (id == null) return;
  const document = await Document.findById(id);
  if (document) return document; // Return existing document
  return await Document.create({ _id: id, data: "" }); // Create new empty document
}

// A standard REST route to get all documents for the homepage dashboard
app.get("/api/documents", async (req, res) => {
  try {
    // Find all documents, sort by most recently updated, and only return the _id and updatedAt fields (we don't need the massive 'data' field just for the list)
    const documents = await Document.find({}, "_id updatedAt").sort({
      updatedAt: -1,
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on("get-document", async (documentId) => {
    // 3. Put the user in the room
    socket.join(documentId);

    // 4. Hit the database (This is an async operation now!)
    const document = await findOrCreateDocument(documentId);

    // 5. Send the DB data back to the client
    socket.emit("load-document", document.data);

    // Listen for text changes
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    // Listen for cursor movements
    socket.on("send-cursor", (range) => {
      socket.broadcast.to(documentId).emit("receive-cursor", {
        id: socket.id,
        range: range,
      });
    });

    // 6. Update MongoDB when the client triggers a save
    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

const PORT = 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
