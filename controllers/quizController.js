const Quiz = require("../models/Quiz");
const Result = require("../models/Result");

exports.testQuiz = async (req, res) => {
  res.status(200).json({
    message: "Quiz Controller Working",
  });
};

exports.createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      questions,
    } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !duration ||
      !questions
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const quiz = await Quiz.create({
      title,
      description,
      duration,
      questions,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();

    res.status(200).json({
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      quiz,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    let score = 0;

    const evaluatedAnswers = [];

    quiz.questions.forEach((question) => {
      const userAnswer = answers.find(
        (ans) =>
          ans.questionId === question._id.toString()
      );

      const isCorrect =
        userAnswer &&
        userAnswer.selectedAnswer ===
        question.correctAnswer;

      if (isCorrect) {
        score++;
      }

      evaluatedAnswers.push({
        questionId: question._id,
        selectedAnswer: userAnswer
          ? userAnswer.selectedAnswer
          : "",
        isCorrect,
      });
    });

    const result = await Result.create({
      user: req.user.id,
      quiz: quiz._id,
      score,
      totalQuestions: quiz.questions.length,
      answers: evaluatedAnswers,
    });

    res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions: quiz.questions.length,
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};