const Blog = require("../models/blog.model");
const View = require("../models/view.model");
const Comment = require("../models/comment.model");
const slugify = require("slugify");

const {
  blogValidationSchema,
  commentValidationSchema,
} = require("../lib/validations/blog.validation");
const { Console } = require("console");

exports.handlegetAllBlogs = async function (req, res) {
  try {
    const blogs = await Blog.find({});
    return res.status(200).json({ blogs });
  } catch (err) {
    res.json(500).json({ error: "Internal Server Error" });
  }
};

exports.handlegetBlogBySlug = async function (req, res) {
  const { slug } = req.params;
  const userIp = req.socket.remoteAddress;

  try {
    const blog = await Blog.findOne({ slug, isActive: true });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Checking if the view from this IP already exists for this blog
    const existingView = await View.findOne({ blogId: blog._id, ip: userIp });

    if (!existingView) {
      // If not, creating a new view record
      await View.create({ blogId: blog._id, ip: userIp });

      // Incrementing the view count for that blog
      blog.views += 1;
      await blog.save();
    } else {
      existingView.views += 1;
      await existingView.save();
    }

    return res.status(200).json({ blog });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.handleCreateBlog = async function (req, res) {
  const validationResult = blogValidationSchema.safeParse(req.body);

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { title, author, body, ip, slug, isActive, views } =
    validationResult.data;

  const ipAddress = ip || req.socket.remoteAddress;

  const convertedSlug = slugify(slug, {
    lower: true, // Convert to lowercase
    strict: true, // Remove special characters
    replacement: "-", // Replace spaces with hyphens
  });

  try {
    const blog = await Blog.create({
      title,
      author,
      body,
      ip: ipAddress,
      slug: convertedSlug,
      isActive,
      views,
    });
    return res.status(201).json({ blog });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ error: "Slug is already taken" });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.handleSoftDeleteBlog = async (req, res) => {
  const { slug } = req.params;

  try {
    // Finding the blog by slug
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Toggling the isActive status
    blog.isActive = !blog.isActive;
    await blog.save();

    return res.status(200).json({
      message: `Blog status updated to ${
        blog.isActive ? "active" : "inactive"
      }`,
      blog,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// user has see views based on ip adddress eg: for ip 1.1.1.1 viewed a blog for 10 times
exports.handlegetViewsbyIpforBlog = async function (req, res) {
  const { slug } = req.params;

  try {
    const blog = await Blog.findOne({ slug, isActive: true });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const viewsByblog = await View.find({ blogId: blog._id });
    //console.log(viewsByblog);
    const viewsByIp = viewsByblog.map((x) => ({
      ip: x.ip,
      views: x.views,
    }));
    return res
      .status(200)
      .json({ blogTitle: blog.title, viewsbyIp: viewsByIp });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//Add comments
exports.handleAddComment = async function (req, res) {
  const { slug } = req.params;
  const validationResult = commentValidationSchema.safeParse(req.body);

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { comment } = validationResult.data;
  try {
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Create a new comment
    const commentadd = await Comment.create({
      blogId: blog._id,
      comment,
    });

    return res.status(201).json({ commentadd });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//get Comments
exports.handleGetComments = async function (req, res) {
  const { slug } = req.params;

  try {
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    //To  Find comments for the blog
    const comments = await Comment.find({ blogId: blog._id });

    return res.status(200).json({ comments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//get All Comments
exports.handleGetAllComments = async function (req, res) {
  try {
    const allComments = await Comment.find().populate("blogId", "title");

    return res.status(200).json({ allComments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
