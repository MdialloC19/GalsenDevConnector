const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //see if user exists

    // Get  users gravatar
    // Encrypt password

    // Return jsonwebtoken
    res.send("USER post route");
  }
);

module.exports = router;
