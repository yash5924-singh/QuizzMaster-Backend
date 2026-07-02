const express = require("express");

const router = express.Router();

const {
  getMyResults,
} = require("../controllers/resultController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.get(
  "/my-results",
  protect,
  getMyResults
);

module.exports = router;