const mongoose = require("mongoose");
const { toPusher } = require("../services/pusher-service");

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
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, 
    timestamps: true
  }
);

// definimos la relacion virtual con los comentarios
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
})

postSchema.post('save', function(post) {
  toPusher('posts', 'new-post', post); // notificamos de un nuevo post para cargar el feed en tiempo real
})

module.exports = mongoose.model("Post", postSchema);
