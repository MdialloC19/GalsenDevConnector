const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const postController = require("../../controllers/postControllers");

/**
 * @desc Route to get all posts.
 * @route GET api/posts
 * @access Private
 */
router.get("/", authMiddleware, postController.getAllPosts);

/**
 * @desc Route to get a single post by id.
 * @route GET api/post/=id
 * @access Private
 */
router.get("/:id", authMiddleware, postController.getPostById);

/**
 * @desc Route to POST a post.
 * @route POST api/posts
 * @access Private
 */
router.post("/", authMiddleware, postController.postAPost);

/**
 * @desc Soft delete a post.
 * @route delete api/post/:id
 * @access Private
 */
router.delete("/", authMiddleware, postController.softDeletePost);

/**
 * @desc Hard delete a post.
 * @route delete api/post/:id
 * @access Private
 */
router.delete("/", authMiddleware, postController.hardDeletePost);

module.exports = router;
