const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
/**
 * @desc Route to get all users.
 * @route GET api/users
 * @access Public
 */
router.get("/", (req, res) => {
  res.send("USER ROUTE");
});

/**
 * @desc Route to get all users.
 * @route POST api/users
 * @access Public
 */
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    // console.log(req.body);
    // res.send("USER post route");

    try {
      let user = await User.findOne({ email });
      //   console.log(user);
      //see if user exists
      if (user) {
        return res.status(400).json({
          errors: [{ msg: "User already exists" }],
        });
      }

      // Get  users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
            message: "User registered",
          });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        sucess: false,
        error: error.message,
      });
    }
  }
);

module.exports = router;
