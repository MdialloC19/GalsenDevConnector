const { validationResult } = require("express-validator");
const Profile = require("../models/Profile");
const { profile_url } = require("gravatar");

exports.getCurrentProfile = async (req, res) => {
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
};

exports.getAllProfiles = async (req, res) => {
  try {
    const allProfiles = await Profile.find({}).populate("user", [
      "name",
      "avatar",
    ]);
    if (!allProfiles) {
      return res.status(400).json({
        errors: [{ msg: "None Profile Found" }],
      });
    }
    return res.status(200).json({
      sucess: true,
      data: allProfiles,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      sucess: false,
      errors: [{ msg: error.message }],
    });
  }
};

exports.getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({
        errors: [{ msg: "There is no profile for this user" }],
      });
    }
    return res.status(200).json({
      sucess: true,
      data: profile,
    });
  } catch (error) {
    console.log(error.message);
    if ((error.kind = "ObjectId")) {
      return res.status(400).json({
        errors: [{ msg: "There is no profile for this user" }],
      });
    }
    return res.status(500).json({
      sucess: false,
      errors: [{ msg: error.message }],
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      ...rest
    } = req.body;

    const profileFields = {
      user: req.user.id,
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills: skills ? skills.split(",").map((skill) => skill.trim()) : [],
      social: { youtube, facebook, twitter, instagram, linkedin },
      ...rest,
    };

    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
    } else {
      profile = new Profile(profileFields);
      await profile.save();
    }

    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, errors: [{ msg: error.message }] });
  }
};

exports.putExperience = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, company, location, from, to, current, description } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.experience.unshift(newExp);

    await profile.save();

    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    onsole.error(error.message);
    return res
      .status(500)

      .json({ success: false, errors: [{ msg: error.message }] });
  }
};

exports.hardDeleteExperience = async (req, res) => {};

exports.deleteProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    /**
     * @todo -remove users posts
     */
    const fieldsToUpdate = { isDeleted: true };
    const options = { new: true };
    // Remove profile

    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: fieldsToUpdate },
      options
    );

    // Remove user

    user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: fieldsToUpdate },
      options
    );

    if (!profile || !user) {
      return res.status(400).json({
        errors: [{ msg: "None user Found" }],
      });
    }
    return res.status(200).json({
      sucess: true,
      data: {
        user,
        profile,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      sucess: false,
      errors: [{ msg: error.message }],
    });
  }
};
