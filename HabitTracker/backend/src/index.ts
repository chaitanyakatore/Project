import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import habitRoutes from "./routes/habitRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Use routes
app.use("/api", habitRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
