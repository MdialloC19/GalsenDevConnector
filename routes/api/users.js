const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const usersControllers = require("../../controllers/usersControllers");
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
  usersControllers.postUser
);

module.exports = router;
