const jwt = require("jsonwebtoken");

const User = require("../models/User");

const bcrypt = require("bcryptjs");

exports.testUser = async (req, res) => {
  res.status(200).json({
    message: "User Controller Working",
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Check Existing User
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

 exports.loginUser = async (req, res) => {
      try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
          return res.status(400).json({
            message: "Please fill all fields",
          });
        }

        // Find User
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(400).json({
            message: "Invalid email or password",
          });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({
            message: "Invalid email or password",
          });
        }

        // Generate Token
        const token = jwt.sign(
          {
            id: user._id,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          },
        );

        res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
          },
        });
      } catch (error) {
        res.status(500).json({
          message: "Server Error",
          error: error.message,
        });
      }
    };

//  Protected Route Example - Get User Profile
 exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(
      req.user.id
    ).select("-password");

    res.status(200).json({
      user,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

