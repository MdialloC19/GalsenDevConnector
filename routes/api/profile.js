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
 * @route PUT api/profile/experience
 * @desc  Update profile with experience
 * @access Private
 */

router.put(
  "/experience",
  [
    authMiddleware,
    check("title", "Title is required").notEmpty(),
    check("company", "Company is required").notEmpty(),
    check("from", "From date is required and needs to be from the past")
      .notEmpty()
      .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  ],
  profileControllers.putExperience
);

/**
 * @route delete api/profile/experience/:exp_id
 * @desc  hard delete for experience profile with experience
 * @access Private
 */
router.delete(
  "/experience/:exp_id",
  authMiddleware,
  profileControllers.hardDeleteExperience
);
/**
 * @route DELETE api/profile
 * @desc Delete profile and user
 * @access Private
 */

router.delete("/", authMiddleware, profileControllers.deleteProfile);

module.exports = router;
