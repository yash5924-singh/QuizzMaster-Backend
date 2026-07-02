const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");
const resultRoutes = require("./routes/resultRoutes");

dotenv.config();

connectDB();

const app = express();

/* ===== CORS Configuration ===== */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://quizz-master-frontend.vercel.app",
    ],
    credentials: true,
  })
);

/* ===== Middleware ===== */
app.use(express.json());

/* ===== Routes ===== */
app.use("/api/users", userRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultRoutes);

/* ===== Test Route ===== */
app.get("/", (req, res) => {
  res.send("Backend Server Running");
});

/* ===== Server ===== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});