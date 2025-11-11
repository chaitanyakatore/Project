const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Load env vars (Do this first)
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- Middlewares ---
app.use(cors()); // Enable CORS
app.use(express.json()); // Body Parser for JSON
app.use(express.urlencoded({ extended: false })); // Body Parser for URL-encoded data

// Serve static files (the uploaded images)
app.use(express.static(path.join(__dirname, "public")));

// --- API Routes ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

// --- Global Error Handler (for Multer, etc.) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Something went wrong" });
  }
  next();
});

// --- Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
