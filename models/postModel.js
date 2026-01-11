const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true, maxLength: 280 },
    image: String,
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// definimos la relacion virtual con los comentarios
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
})

module.exports = mongoose.model("Post", postSchema);
