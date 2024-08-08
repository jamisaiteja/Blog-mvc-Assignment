const express = require("express");
const router = express.Router();
const {
  handlegetAllBlogs,
  handlegetBlogBySlug,
  handleCreateBlog,
  handleSoftDeleteBlog,
  handlegetViewsbyIpforBlog,
  handleAddComment,
  handleGetComments,
  handleGetAllComments,
} = require("../controller/blog.controller");

//Route to get all blogs
router.get("/", handlegetAllBlogs);

//Route to get Blog by Slug
router.get("/blog/:slug", handlegetBlogBySlug);

// Route to Create Blog
router.post("/", handleCreateBlog);

//Route to Soft Delete
router.patch("/delete/:slug", handleSoftDeleteBlog);

// Route to get Views By Ip for a blog using slug
router.get("/:slug/views", handlegetViewsbyIpforBlog);

// Route to add a comment to a blog
router.post("/:slug/comments", handleAddComment);

// Route to get all comments for a blog
router.get("/:slug/getComments", handleGetComments);

//Route to get all comments
router.get("/getallComments", handleGetAllComments);

module.exports = router;
