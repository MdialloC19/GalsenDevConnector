const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

/**
 * @desc Route to get current profile.
 * @route GET api/profile/me
 * @access Private
 */
router.get("/me", authMiddleware, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  try {
    let currentProfile = await Profile.findOne({ user: userId }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!currentProfile) {
      return res.status(400).json({
        errors: [{ msg: "Profile Not Found" }],
      });
    }
    return res.status(200).json({
      sucess: true,
      data: currentProfile,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      sucess: false,
      errors: [{ msg: error.message }],
    });
  }
});

module.exports = router;
