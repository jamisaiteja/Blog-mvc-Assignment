const mongoose = require("mongoose");
const { z } = require("zod");

//const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const blogValidationSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  body: z.string().min(1, { message: "Body is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  isActive: z.boolean().optional(),
  ip: z.string().optional(),
  views: z.number().optional(),
});

const commentValidationSchema = z.object({
  comment: z.string(),
});
module.exports = {
  blogValidationSchema,
  commentValidationSchema,
};
