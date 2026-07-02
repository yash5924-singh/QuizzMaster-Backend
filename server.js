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

app.use(cors());

app.use(express.json());

app.use("/api/quizzes", quizRoutes);


app.use("/api/users", userRoutes);

app.use("/api/results", resultRoutes);


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend Server Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});