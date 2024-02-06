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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user.id;
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let currentProfile = await Profile.findOne({ user: userId });

      if (currentProfile) {
        // update the profile
        const profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.status(200).json({
          sucess: true,
          data: profile,
        });
      }
      currentProfile = new Profile(profileFields);
      await currentProfile.save();

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
  }
);

module.exports = router;
