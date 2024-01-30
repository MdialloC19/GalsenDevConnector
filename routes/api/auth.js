const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
/**
 * @desc Route to get all auth.
 * @route GET api/auth
 * @access Public
 */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(200).json({
      sucess: false,
      message: "Server error",
    });
  }
});

/**
 * @desc Authenticate user & get token
 * @route POST api/auth
 * @access Public
 */
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "passsword is required ").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(email, password);

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

      // const salt = await bcrypt.genSalt(10);

      // user.password = await bcrypt.hash(password, salt);

      // await user.save();

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
  }
);

module.exports = router;
