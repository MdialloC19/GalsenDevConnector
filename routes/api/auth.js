const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { check } = require("express-validator");
const authControllers = require("../../controllers/authControllers");

/** 
 * @desc Route to get all auth.
 * @route GET api/auth
 * @access Public
 *
 * /
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
  authControllers.postAuth
);

module.exports = router;
