const { validationResult } = require("express-validator");
const Post = require("../models/Post");
const { options } = require("../app");

exports.getAllPosts = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const posts = await Post.find({}).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      sucess: false,
      errors: [{ msg: error.message }],
    });
  }
};

exports.getPostById = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({
        errors: [{ msg: "There is no post for this user" }],
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        errors: [{ msg: "There is no post for this user" }],
      });
    }
    res.status(500).json({
      sucess: false,
      errors: [{ msg: error.message }],
    });
  }
};

exports.postAPost = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    });

    const post = await newPost.save();
    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      sucess: false,
      errors: [{ msg: error.message }],
    });
  }
};

exports.softDeletePost = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({
        errors: [{ msg: "There is no post for this user" }],
      });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        errors: [{ msg: "User not authorized" }],
      });
    }

    const fieldsToUpdate = {
      isDeleted: true,
    };

    options = { new: true };

    post = await Post.findOneAndUpdate(
      { _id: req.user.id },
      { $set: fieldsToUpdate },
      options
    );

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.log(error.message);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        errors: [{ msg: "There is no post for this user" }],
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Post removed",
    });
  }
};

exports.hardDeletePost = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({
        errors: [{ msg: "There is no post for this user" }],
      });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        errors: [{ msg: "User not authorized" }],
      });
    }
    await post.remove();

    return res.status(200).json({
      success: true,
      msg: "Post removed",
    });
  } catch (error) {
    console.log(error.message);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        errors: [{ msg: "There is no post for this user" }],
      });
    }

    res.status(500).json({
      sucess: false,
      errors: [{ msg: error.message }],
    });
  }
};
