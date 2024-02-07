const User = require("../models/User");
const { validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.postAuth = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  // console.log(email, password);

  try {
    let user = await User.findOne({ email });
    console.log(user);
    //see if user exists
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "Invalid Credentials user" }],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        errors: [{ msg: "Invalid Credentials" }],
      });
    }
    // Encrypt password

    // Return jsonwebtoken

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        return res.status(201).json({
          token,
          sucess: true,
          message: "Authentificated",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      sucess: false,
      error: error.message,
    });
  }
};
