const express = require("express");

const router = express.Router();

const {
  testQuiz,
  createQuiz,
  getAllQuizzes,
  getQuizById,
  submitQuiz,
} = require("../controllers/quizController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.get("/test", testQuiz);


router.post(
  "/create",
  protect,
  createQuiz
);
router.get(
  "/",
  protect,
  getAllQuizzes
);
router.get(
  "/:id",
  protect,
  getQuizById
);
router.post(
  "/:id/submit",
  protect,
  submitQuiz
);

module.exports = router;