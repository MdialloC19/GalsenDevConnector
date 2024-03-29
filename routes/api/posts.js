const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const postController = require("../../controllers/postControllers");
const { check } = require("express-validator");

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
 * @route delete api/post/soft/:id
 * @access Private
 */
router.delete("/soft/:id", authMiddleware, postController.softDeletePost);

/**
 * @desc Hard delete a post.
 * @route delete api/post/:id
 * @access Private
 */
router.delete("/hard/:id", authMiddleware, postController.hardDeletePost);

/**
 * @desc Like a post
 * @route PUT api/post/like/:id
 * @access Private
 */
router.put("/like/:id", authMiddleware, postController.likeAPost);

/**
 * @desc Unlike a post
 * @route PUT api/post/unlike/:id
 * @access Private
 */
router.put("/unlike/:id", authMiddleware, postController.unLikeAPost);

/**
 * @desc Post a comment for a post.
 * @route delete api/post/comment/:id
 * @access Private
 */
router.post(
  "/comment/:id",
  [authMiddleware, check("text", "Text is required").notEmpty()],
  postController.postComment
);

/**
 * @desc Soft delete a comment for a post.
 * @route delete api/post/comment/:id
 * @access Private
 */
router.delete(
  "/comment/:id/:comment_id",
  authMiddleware,
  postController.deleteComment
);

module.exports = router;
