const Result = require("../models/Result");

exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({
      user: req.user.id,
    })
      .populate("quiz", "title description")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};