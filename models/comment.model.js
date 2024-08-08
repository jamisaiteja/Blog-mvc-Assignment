const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("Comment", commentSchema);
