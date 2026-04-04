require("dotenv").config();
const express = require("express");
const cors = require("cors");

// --- NEW: Import our custom middleware ---
const verifyToken = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Public Route (Anyone can access this, no token required)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// --- NEW: Protected Route ---
// Notice how we put 'verifyToken' IN THE MIDDLE of the route definition.
// Express runs verifyToken first. If it succeeds, it runs the arrow function.
app.post("/api/orders", verifyToken, (req, res) => {
  // If the code reaches here, we are 100% sure the user is authenticated.
  res.status(200).json({
    message: "Order received!",
    userMakingRequest: req.userId, // This was attached by our middleware!
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server locked and loaded on http://localhost:${PORT}`);
});
