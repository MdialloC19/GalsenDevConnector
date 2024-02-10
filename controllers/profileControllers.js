const { validationResult } = require("express-validator");
const Profile = require("../models/Profile");
const request = require("request");
const config = require("config");
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

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      success: false,
      errors: [{ msg: error.message }],
    });
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

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error(error.message);

    return res
      .status(500)
      .json({ success: false, errors: [{ msg: error.message }] });
  }
};

exports.hardDeleteExperience = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience = profile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );
    await profile.save();
    return res.status(200).json({
      sucess: true,
      data: profile,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, errors: [{ msg: error.message }] });
  }
};

exports.softDeleteExperience = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const fieldsToUpdate = { "experience.$.isDeleted": true };
    const options = { new: true };
    const profile = await Profile.findOneAndUpdate(
      {
        user: req.user.id,
        "experience._id": req.params.exp_id,
      },

      {
        $set: { "experience.$.isDeleted": true },
      },
      options
    );
    return res.status(200).json({
      sucess: true,
      data: profile,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      sucess: false,
      errors: [{ msg: error.message }],
    });
  }
};

exports.putEducation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.education.unshift(req.body);

    await profile.save();

    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, errors: [{ msg: error.message }] });
  }
};

exports.softDeleteEducation = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const fieldsToUpdate = { "education.$.isDeleted": true };

    const options = { new: true };

    const profile = await Profile.findOneAndUpdate(
      {
        user: req.user.id,
        "education._id": req.params.edu_id,
      },

      {
        $set: fieldsToUpdate,
      },
      options
    );

    return res.status(200).json({
      sucess: true,
      data: profile,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      sucess: false,
      errors: [{ msg: error.message }],
    });
  }
};

exports.hardDeleteEducation = async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.education = foundProfile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    );

    await foundProfile.save();

    return res.status(200).json({
      success: true,
      data: foundProfile,
    });
  } catch (error) {
    console.error(error.message);

    return res
      .status(500)
      .json({ success: false, errors: [{ msg: error.message }] });
  }
};

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

exports.getGithubProfile = async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClient"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.log(error);
      if (response.statusCode !== 200) {
        res.status(404).json({
          sucess: false,
          errors: [{ msg: "No Gihbub profile found" }],
        });
      }
      return res.status(200).json({
        sucess: true,
        data: JSON.parse(body),
      });
    });

    // const headers = {
    //   "user-agent": "node.js",
    //   Authorization: `token ${config.get("githubToken")}`,
    // };
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      sucess: false,
      errors: [{ msg: error.message }],
    });
  }
};
