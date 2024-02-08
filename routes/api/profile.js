const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const { check } = require("express-validator");
const profileControllers = require("../../controllers/profileControllers");
/**
 *
 * @desc Route to get current profile.
 * @route GET api/profile/me
 * @access Private
 */
router.get("/me", authMiddleware, profileControllers.getCurrentProfile);

/**
 * @desc Route to get All profile.
 * @route GET api/profile/me
 * @access Public
 */

router.get("/", profileControllers.getAllProfiles);

/**
 * @route GET api/profile/user/:user_id
 * @desc GET profile by user ID
 * @access Public
 */

router.get("/user/:user_id", profileControllers.getProfileByUserId);
/**
 * @route POST api/profile
 * @desc Create or Update user Profile
 * @access Private
 */

router.post(
  "/",
  [
    authMiddleware,
    [
      check("status", "Status is required").notEmpty(),
      check("skills", "Skills is required").notEmpty(),
    ],
  ],
  profileControllers.updateUserProfile
);

/**
 * @route DELETE api/profile
 * @desc Delete profile and user
 * @access Private
 */

router.delete("/", authMiddleware, profileControllers.deleteProfile);

module.exports = router;
