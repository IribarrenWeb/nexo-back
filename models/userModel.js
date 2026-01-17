const mongoose = require("mongoose");
const argon2 = require('argon2');

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
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, 
    timestamps: true
  }
);

usersSchema.pre("save", async function () {
  const user = this;
  
  if (user.isModified("password")) {
    try {
      const hash = await argon2.hash(user.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, 
        timeCost: 3,
        parallelism: 1 
      });
      
      user.password = hash;
    } catch (err) {
      throw new Error(err);
    }
  }
});

usersSchema.methods.validatePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (err) {
    throw new Error(err);
  }
};

// atributo virtual fullName para obtener el nombre completo del usuario
usersSchema.virtual("fullName").get(function () {
  return `${this.name} ${this.lastName}`;
})

module.exports = mongoose.model("User", usersSchema);
