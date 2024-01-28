const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const User = require("../../models/User");

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

module.exports = router;
