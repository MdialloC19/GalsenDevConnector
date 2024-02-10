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
 * @route Soft delete api/profile/exp/:exp_id
 * @desc  soft delete for experience profile with experience
 * @access Private
 */
router.delete(
  "/exp/:exp_id",
  authMiddleware,
  profileControllers.softDeleteExperience
);

/**
 * @route Hard delete api/profile/experience/:exp_id
 * @desc  hard delete for experience profile with experience
 * @access Private
 */
router.delete(
  "/experience/:exp_id",
  authMiddleware,
  profileControllers.hardDeleteExperience
);

/**
 * @route PUT api/profile/education
 * @desc  Update profile with education
 * @access Private
 */

router.put(
  "/education",
  [
    authMiddleware,
    check("school", "School is required").notEmpty(),
    check("degree", "Degree is required").notEmpty(),
    check("fieldofstudy", "Field of study is required").notEmpty(),
    check("from", "From date is required and needs to be from the past")
      .notEmpty()
      .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  ],
  profileControllers.putEducation
);

/**
 * @route Soft delete api/profile/edu/:edu_id
 * @desc  soft delete for education profile with education
 * @access Private
 */
router.delete(
  "/edu/:edu_id",
  authMiddleware,
  profileControllers.softDeleteEducation
);

/**
 * @route delete api/profile/education/:edu_id
 * @desc  hard delete for education profile with education
 * @access Private
 */
router.delete(
  "/education/:edu_id",
  authMiddleware,
  profileControllers.hardDeleteEducation
);

/**
 * @route DELETE api/profile
 * @desc Delete profile and user
 * @access Private
 */

router.delete("/", authMiddleware, profileControllers.deleteProfile);

/**
 * @route    GET api/profile/github/:username
 * @desc     Get user repos from Github
 * @access   Public
 */

router.get("/github/:username", profileControllers.getGithubProfile);
module.exports = router;
