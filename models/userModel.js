const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: String,
    bio: String,
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deactivated: {
      type: Boolean,
      default: false,
    },
    rol: {
      type: String,
      default: "user",
      enum: ["user", "admin", "moderador"],
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", usersSchema);
